import React, { useEffect } from "react";
import Message from "./Message";
import { useState } from "react";
import "./Messages.css";
import { useParams } from "react-router";
import { domain } from "../../App";
import { useAuth } from "../../contexts/auth";

export default function Messages() {
  const { threadName } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const { user, authenticated } = useAuth();

  useEffect(async () => {
    await loadMessages();
  }, []);

  async function loadMessages() {
    let request = new Request(domain + "/messages?threadName=" + threadName);
    let data = await fetch(request);
    data = await data.json();
    document.title = threadName;
    setMessages(data);
  }

  if (messages.length == 0) {
    return <div>Keine Nachrichten vorhanden.</div>;
  }

  async function sendText() {
    let request = new Request(domain + "/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `apiKey=${user.apiKey}&content=${text}&contentType=0&threadId=${1}`,
    });
    let result = await fetch(request);
    if (result.ok) {
      setText("");
      await loadMessages();
    } else {
      alert("Fehler beim Senden.");
    }
  }

  return (
    <div className="message-page-content">
      <h2>{messages.length > 0 ? messages[0].thread.caption : ""}</h2>
      <br></br>
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
