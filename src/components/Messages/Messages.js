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
import TextareaAutosize from "react-textarea-autosize";

export const uploadImageFileSize = 800;

let userIdAvatarDic = {};

/**
 * Ruft den Avatar des Nutzers ab
 * @param {Number} id
 * Id der Nutzers
 * @returns
 * Den Avatar
 */
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

/**
 * Ruft die Darstellung aller Nachrichten auf dieser Seite ab
 * @returns
 * Darstellung aller Nachrichten der Seite
 */
export default function Messages() {
  const { threadName, groupName } = useParams();
  const [thread, setThread] = useState(undefined);
  const [text, setText] = useState("");
  const { user, authenticated, isUser } = useAuth();

  const [messages, setMessages] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage] = useState(30);

  const [fileInput, setFileInput] = useState(undefined);
  /**
   * Handler zum Öffnen einer Datei
   */
  function handleOpen() {
    fileInput.click();
  }

  /**
   * Setzt die aktuelle Seite innerhalb des Threads
   * @param {Number} number
   * Aktuelle Seite
   */
  function paginate(number) {
    setCurrentPage(number);
  }

  useEffect(async () => {
    await loadThread();
    await loadMessages();
  }, []);

  /**
   * Lädt den Thread.
   */
  async function loadThread() {
    let request = new Request(
      domain +
        "/threads?threadName=" +
        encodeURIComponent(threadName) +
        "&groupName=" +
        encodeURIComponent(groupName)
    );
    let data = await fetch(request);
    data = await data.json();
    document.title = `${data.threadGroup.caption} - ${data.caption}`;
    setThread(data);
  }

  /**
   * Lädt die Nachrichten des Threads
   */
  async function loadMessages() {
    let request = new Request(
      domain +
        "/messages?threadName=" +
        encodeURIComponent(threadName) +
        "&groupName=" +
        encodeURIComponent(groupName)
    );
    let data = await fetch(request);
    data = await data.json();
    for (let i = 0; i < data.length; i++) {
      data[i].sender.avatar = await getAvatar(data[i].sender.id);

      if (["Text", "Quote"].includes(data[i].contentId)) {
      }
    }
    setMessages(data);
  }

  /**
   * Ruft das zusendente Bild ab und wandelt es in Base64 um
   * @param {Event} event
   * Auswahl der Datei
   */
  async function sendImage(event) {
    var file = event.target.files[0];

    if (file.type.match(/image.*/)) {
      var reader = new FileReader();
      reader.onload = function (readerEvent) {
        var image = new Image();
        image.onload = async function (imageEvent) {
          var canvas = document.createElement("canvas"),
            max_size = uploadImageFileSize,
            width = image.width,
            height = image.height;
          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(image, 0, 0, width, height);
          var dataUrl = canvas.toDataURL("image/png");
          await send(dataUrl, 1);
        };
        image.src = readerEvent.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Sendet den Text
   */
  async function sendText() {
    let tmp = text;
    setText("");
    let result = await send(tmp, 0);
    if (!result) {
      setText(tmp);
    }
  }

  /**
   * Stellt den Request ans Servlet um eine Nachricht zu versenden.
   * @param {String} content
   * Inhalt der Nachricht
   * @param {Number} type
   * Typ der Nachricht
   * @returns
   * True, falls Erfolgreich gesendet, ansonsten false.
   */
  async function send(content, type) {
    content = encodeURIComponent(content);

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

  /**
   * Löscht die Nachricht
   * @param {Number} messageId
   * Id der zu löschenden Nachricht
   * @returns
   * True, wenn erfolgreich gelöscht wurde, ansonsten false
   */
  async function deleteMessage(messageId) {
    let request = new Request(domain + "/messages", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `apiKey=${user.apiKey}&messageId=${messageId}`,
    });
    let result = await fetch(request);

    if (result.ok) {
      await loadMessages();
    } else {
      alert("Fehler beim Löschen.");
    }
    return result.ok;
  }

  /**
   * Handler dass die Nachricht auch beim Drücken von Enter abgesendet wird
   * @param {Event} e
   * Enter Taste gedrückt
   */
  async function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      await sendText();
    }
  }

  //Gibt ein Ladesymbol aus bis der Thread geladen ist
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

  //Gibt die Gesamtansicht des Threads mit allen Nachrichten, auf der Seite des Threads,zurück
  return (
    <div className="message-page-content">
      <Breadcrumb groupName={groupName} threadName={threadName} />
      <h3>{thread.caption}</h3>
      <pre className="block">
        <i>{thread.description}</i>
      </pre>
      <br></br>
      {messages ? (
        <>
          {messages.length === 0 ? (
            <p className="noMessagesWarning">Keine Nachrichten vorhanden.</p>
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

          <TextareaAutosize
            onChange={(e) => setText(e.target.value)}
            className="messageInput"
            onKeyDown={handleKeyDown}
            type="text"
            value={text}
          ></TextareaAutosize>

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
