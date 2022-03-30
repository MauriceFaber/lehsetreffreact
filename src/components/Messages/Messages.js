import React, { useEffect, useRef } from "react";
import Message from "./Message";
import { useState } from "react";
import "./Messages.css";
import { useParams } from "react-router";
import { domain } from "../../App";
import { useAuth } from "../../contexts/Authentication";
import "../Loader/Loader.css";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import Pagination from "../Pagination/Pagination";

let userIdAvatarDic = {};

export function replaceURLs(message) {
  if (!message) return;

  var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
  return message.replace(urlRegex, function (url) {
    var hyperlink = url;
    if (!hyperlink.match("^https?://")) {
      hyperlink = "http://" + hyperlink;
    }
    return (
      '<a href="' +
      hyperlink +
      '" target="_blank" rel="noopener noreferrer">' +
      url +
      "</a>"
    );
  });
}

export async function getAvatar(id) {
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

export default function Messages() {
  const { threadName, groupName } = useParams();
  const [thread, setThread] = useState(undefined);
  const [text, setText] = useState("");
  const { user, authenticated, isUser } = useAuth();
  const [fileInput, setFileInput] = useState(undefined);

  const [messages, setMessages] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage] = useState(30);

  function paginate(number) {
    setCurrentPage(number);
  }

  useEffect(async () => {
    await loadThread();
    await loadMessages();
    window.scrollTo(0, document.body.scrollHeight);
  }, []);

  async function loadThread() {
    let request = new Request(
      domain + "/threads?threadName=" + threadName + "&groupName=" + groupName
    );
    let data = await fetch(request);
    data = await data.json();
    document.title = `${data.threadGroup.caption} - ${data.caption}`;
    setThread(data);
  }

  async function loadMessages() {
    let request = new Request(
      domain + "/messages?threadName=" + threadName + "&groupName=" + groupName
    );
    let data = await fetch(request);
    data = await data.json();
    for (let i = 0; i < data.length; i++) {
      data[i].sender.avatar = await getAvatar(data[i].sender.id);

      if (["Text", "Quote"].includes(data[i].contentId)) {
        data[i].content = replaceURLs(data[i].content);
      }
    }
    setMessages(data);
  }

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  async function sendImage(event) {
    var file = event.target.files[0];
    var dataUrl = await toBase64(file);
    await send(dataUrl, 1);
  }

  async function sendText() {
    let tmp = text;
    setText("");
    let result = await send(tmp, 0);
    if (!result) {
      setText(tmp);
    }
  }

  async function send(content, type) {
    let request = new Request(domain + "/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `apiKey=${user.apiKey}&content=${encodeURIComponent(
        content
      )}&contentType=${type}&threadId=${thread.id}`,
    });
    let result = await fetch(request);

    if (result.ok) {
      await loadMessages();
    } else {
      alert("Fehler beim Senden.");
    }
    return result.ok;
  }

  async function deleteMessage(messageId) {
    let request = new Request(domain + "/messages", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `apiKey=${user.apiKey}&messageId=${messageId}`,
    });
    let result = await fetch(request);
    console.log(result);

    if (result.ok) {
      await loadMessages();
    } else {
      alert("Fehler beim Löschen.");
    }
    return result.ok;
  }

  function handleOpen() {
    fileInput.click();
  }

  async function handleKeyDown(e) {
    if (e.key === "Enter") {
      await sendText();
    }
  }

  if (!thread) {
    return (
      <>
        <h2>{threadName}</h2>
        <div className="centered-loader">
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </>
    );
  }

  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messages
    ? messages.slice(indexOfFirstMessage, indexOfLastMessage)
    : undefined;

  return (
    <div className="message-page-content">
      <Breadcrumb groupName={groupName} threadName={threadName} />
      <h3>{thread.caption}</h3>
      <p className="block">
        <i>{thread.description}</i>
      </p>
      <br></br>
      {messages ? (
        <>
          {messages.length === 0 ? (
            "Keine Nachrichten vorhanden."
          ) : (
            <>
              <Pagination
                currentNumber={currentPage}
                itemsPerPage={messagesPerPage}
                totalItems={messages.length}
                paginate={paginate}
              />
              {currentMessages.map((message, index) => {
                const key = `message_${message.id}`;
                return (
                  <Message
                    key={key}
                    currentPage={currentPage}
                    index={index}
                    message={message}
                    deleteMessage={deleteMessage}
                  />
                );
              })}
              <Pagination
                currentNumber={currentPage}
                itemsPerPage={messagesPerPage}
                totalItems={messages.length}
                paginate={paginate}
              />
            </>
          )}
        </>
      ) : (
        <div className="centered-loader">
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      {authenticated && isUser ? (
        <div className="send-message-box">
          <div className="button-wrapper first-button">
            <a className="imageButton" onClick={handleOpen}>
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

          <input
            ref={(input) => setFileInput(input)}
            className="hiddenDisplayNone"
            onChange={(e) => sendImage(e)}
            type="file"
          />
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
