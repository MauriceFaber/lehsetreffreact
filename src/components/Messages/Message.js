import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/Authentication";
import "./Messages.css";
import "./Messages";
import { domain } from "../../App";
import { getAvatar } from "./Messages";

/**
 * Ruft die einzelnen Nachrichten ab.
 * @param {Message} message
 * Nachricht die angezeigt wird.
 * @param {Index} currentPage
 * Index der aktuellen Seite.
 * @param {Index} index
 * Index der Nachricht.
 * @param {Function} deleteMessage
 * Löschen der Nachricht.
 * @param {Boolean} isQuoted
 * Flag zum anzeigen ob es sich um ein Zitat handelt.
 * @returns
 * Ansicht der einzelnen Nachricht.
 */
export default function Message({
  message,
  currentPage,
  index,
  deleteMessage,
  isQuoted,
}) {
  const date = new Date(message?.timeStamp);
  const { user, authenticated, isModerator, isUser } = useAuth();
  const [quotedMessage, setQuotedMessage] = useState();

  const isSender =
    !authenticated || !isUser ? false : message.sender.id === user.id;

  /**
   * Abfrage ob die Nachricht wirklich gelöscht werden soll
   */
  async function onDeleteMessage() {
    if (!window.confirm(`Nachricht wirklich löschen?`)) {
      return;
    }
    await deleteMessage(message.id);
  }

  /**
   * Lädt eine Nachricht.
   * @param {Number} messageId
   * Id der Nachricht.
   * @returns
   * Json der Nachricht.
   */
  async function loadMessage(messageId) {
    let result = await fetch(
      new Request(domain + "/messages?messageId=" + messageId)
    );
    if (result.ok) {
      let tmp = await result.json();
      tmp.sender.avatar = await getAvatar(tmp.sender.id);
      return tmp;
    }
    return undefined;
  }

  useEffect(async () => {
    if (message.additional) {
      let id = parseInt(message.additional);
      let result = await loadMessage(id);
      if (!result) {
        result = {
          sender: {
            name: "",
            avatar: "",
          },
          contentId: "DELETED",
        };
      }
      setQuotedMessage(result);
    }
  }, []);

  const dateString = message.timeStamp ? date.toLocaleString("de-DE") : "";

  //Gibt die einzelnen Nachrichten aus mitsamt Nutzerinformationen und Buttons
  return (
    <div
      className={`messageContainer ${
        index === 0 && currentPage === 1 ? "firstMessage" : ""
      } ${isQuoted ? "quotedMessage" : ""}`}
    >
      {!isQuoted ? (
        <div className="senderInformation">
          <div className="avatar-wrapper h-item">
            <img className="avatar" alt="bild" src={message.sender.avatar} />
          </div>
          <div className="senderName h-item">{message.sender.userName}</div>
          <div className="userRole h-item">{message.sender.role}</div>
          <p className="timeStamp h-item">{dateString}</p>
        </div>
      ) : null}
      {isQuoted ? (
        <div className="senderInformation">
          <div className="senderName h-item">{message.sender.userName}</div>
          <p className="timeStamp h-item">{dateString}</p>
        </div>
      ) : null}
      {message.contentId === "Text" ? (
        <pre>
          {message.content}
          {message.wasModified ? <i>&nbsp;(bearbeitet)</i> : null}
        </pre>
      ) : null}
      {message.contentId === "Image" ? (
        <img className="image" alt="bild" src={message.content} />
      ) : null}
      {message.contentId === "Quote" ? (
        <div>
          <div className="quoted">
            {quotedMessage ? (
              <Message
                isQuoted={true}
                message={quotedMessage}
                currentPage={currentPage}
                index={index}
                deleteMessage={deleteMessage}
              />
            ) : null}
          </div>
          <pre>{message.content}</pre>
        </div>
      ) : null}
      {message.contentId === "DELETED" ? (
        <p>
          <i>(gelöscht)</i>
        </p>
      ) : null}
      <ul className="actionList">
        {authenticated && !isQuoted && message.contentId != "DELETED" ? (
          <li>
            <a
              className="deleteButton"
              href={`/${message.thread.threadGroup.caption}/${message.thread.caption}/quoteMessage/${message.id}`}
            >
              <i className="fas fa-quote-left"></i>
            </a>
          </li>
        ) : null}
        {!isQuoted &&
        authenticated &&
        (((isSender || isModerator) && message.contentId !== "DELETED") ||
          (isModerator && message.contentId === "DELETED")) ? (
          <>
            {isSender && message.contentId === "Text" ? (
              <>
                <li>
                  <a
                    className="deleteButton"
                    href={`/${message.thread.threadGroup.caption}/${message.thread.caption}/editMessage/${message.id}`}
                  >
                    <i className="fas fa-pen"></i>
                  </a>
                </li>
              </>
            ) : null}
            <li>
              <a href="#" className="deleteButton" onClick={onDeleteMessage}>
                <i className="fas fa-trash"></i>
              </a>
            </li>
          </>
        ) : null}
      </ul>
    </div>
  );
}
