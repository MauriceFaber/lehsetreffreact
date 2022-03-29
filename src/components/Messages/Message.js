import React ,{ useState, useEffect } from "react";
import { useAuth } from "../../contexts/Authentication";
import "./Messages.css";
import "./Messages";

export default function Message({ message, currentPage, index, deleteMessage, editMessage }) {
  const date = new Date(message.timeStamp);
  const { user, authenticated, isModerator } = useAuth();

  const isSender = message.sender.id == user.id;

  async function onDeleteMessage() {
    await deleteMessage(message.id);
  }

  async function onEditMessage() {
    await editMessage(message.id);
  }

  const dateString = date.toLocaleString("de-DE");
  console.log(isSender);
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
      {message.contentId == "Text" ? <p>{message.content}</p> : null}
      {message.contentId == "Image" ? (
        <img className="image" src={message.content} />
      ) : null}
      {message.contentId == "Empty" ? <p>{message.content}</p> : null}
      {isSender || isModerator ? (
        <ul className="actionList">
          {isSender ? (
          <li>
            <a
              className="deleteButton" onClick={onEditMessage}
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
