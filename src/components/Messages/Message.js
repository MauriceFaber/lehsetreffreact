import React ,{ useState, useEffect } from "react";
import { useAuth } from "../../contexts/Authentication";
import "./Messages.css";
import "./Messages";

export default function Message({ message, currentPage, index, deleteMessage, editMessage }) {
  const date = new Date(message.timeStamp);
  const { user, authenticated, isModerator } = useAuth();

  const isSender = message.sender.id == user.id;

  async function onDeleteMessage() {
    if (!window.confirm(`Nachricht wirklich löschen?`)) {
      return;
    }
    await deleteMessage(message.id);
  }

  const dateString = date.toLocaleString("de-DE");
  console.log(message.wasModified);
  return (
    <div
      className={`messageContainer ${
        index == 0 && currentPage == 1 ? "firstMessage" : ""
      }`}
    >
      <div className="senderInformation">
        <div className="avatar-wrapper h-item">
          <img className="avatar" src={message.sender.avatar} />
        </div>
        <a className="senderName h-item">{message.senderName}</a>
        <div className="userRole h-item">{message.sender.role}</div>
        <p className="timeStamp h-item">{dateString}</p>
      </div>
      {message.contentId == "Text" ? <p>{message.content}
      {message.wasModified ? <i>&nbsp;(bearbeitet)</i>: null }</p> : null}
      {message.contentId == "Image" ? (
        <img className="image" src={message.content} />
      ) : null}
      {message.contentId == "Empty" ? <p>{message.content}</p> : null}
      {message.contentId == "DELETED" ? <p><i>(gelöscht)</i></p> : null}
      {(isSender || isModerator) && message.contentId != "DELETED" ? (
        <ul className="actionList">
          {isSender && message.contentId == "Text" ? (
          <li>
            <a
              className="deleteButton" 
              href={`/${message.thread.threadGroup.caption}/${message.thread.caption}/editMessage/${message.id}`}
            >
              <i className="fas fa-pen"></i>
            </a>
          </li>
          ) : null}
            <li>
              <a className="deleteButton" onClick={onDeleteMessage}>
                <i className="fas fa-trash"></i>
              </a>
            </li>   
        </ul> 
      ) : null}
    </div>
  );
}
