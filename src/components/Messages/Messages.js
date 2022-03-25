import React, { useEffect } from "react";
import Message from "./Message";
import { useState } from "react";
import "./Messages.css";
import { useParams } from "react-router";
import { domain } from "../../App";
import { useAuth } from "../../contexts/Auth";

export default function Messages() {
  const { threadName } = useParams();
  const [thread, setThread] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const { user, authenticated } = useAuth();

  let userIdAvatarDic = {};

  async function getAvatar(id) {
    if (userIdAvatarDic[id]) {
      return userIdAvatarDic[id];
    } else {
      let request = new Request(domain + `/users?id=${id}`);
      let data = await fetch(request);
      data = await data.json();

      userIdAvatarDic[id] = data.avatar;
      return data.avatar;
    }
  }

  useEffect(async () => {
    await loadThread();
    await loadMessages();
  }, []);

  async function loadThread() {
    let request = new Request(domain + "/threads?threadName=" + threadName);
    let data = await fetch(request);
    data = await data.json();
    document.title = threadName;
    setThread(data);
  }

  async function loadMessages() {
    let request = new Request(domain + "/messages?threadName=" + threadName);
    let data = await fetch(request);
    data = await data.json();
    document.title = threadName;
    for (let i = 0; i < data.length; i++) {
      data[i].sender.avatar = await getAvatar(data[i].sender.id);
    }
    setMessages(data);
  }

  async function sendText() {
    let content = text;
    setText("");
    let request = new Request(domain + "/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `apiKey=${user.apiKey}&content=${content}&contentType=0&threadId=${thread.id}`,
    });
    let result = await fetch(request);
    if (result.ok) {
      await loadMessages();
    } else {
      setText(content);
      alert("Fehler beim Senden.");
    }
  }

  async function handleKeyDown(e) {
    if (e.key === "Enter") {
      await sendText();
    }
  }

  if (!thread) {
    return <div>...</div>;
  }

  return (
    <div className="message-page-content">
      <h2>{thread.caption}</h2>
      <br></br>
      {messages.length == 0 ? <div>Keine Nachrichten vorhanden.</div> : null}
      {messages.map((message, index) => {
        const key = `message_${message.id}`;
        return <Message key={key} message={message} />;
      })}
      {authenticated ? (
        <div className="send-message-box">
          <div className="button-wrapper first-button">
            <a className="imageButton">
              <i className="fas fa-image"></i>
            </a>
          </div>
          <input
            onChange={(e) => setText(e.target.value)}
            className="messageInput"
            onKeyDown={handleKeyDown}
            type="text"
            value={text}
          ></input>
          <div className="button-wrapper last-button">
            <a onClick={sendText} className="sendButton">
              <i className="fas fa-paper-plane"></i>
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
