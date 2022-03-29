import React from "react";
import { useAuth } from "../../contexts/Authentication";
import "./Messages.css";
import "./Messages";

export default function Message({
  message,
  currentPage,
  index,
  deleteMessage,
}) {
  const date = new Date(message.timeStamp);
  const { user, authenticated, isModerator, isUser } = useAuth();

  const isSender =
    !authenticated || !isUser ? false : message.sender.id === user.id;

  async function onDeleteMessage() {
    if (!window.confirm(`Nachricht wirklich löschen?`)) {
      return;
    }
    await deleteMessage(message.id);
  }

  const dateString = date.toLocaleString("de-DE");

  return (
    <div
      className={`messageContainer ${
        index === 0 && currentPage === 1 ? "firstMessage" : ""
      }`}
    >
      <div className="senderInformation">
        <div className="avatar-wrapper h-item">
          <img className="avatar" alt="bild" src={message.sender.avatar} />
        </div>
        <div className="senderName h-item">{message.sender.userName}</div>
        <div className="userRole h-item">{message.sender.role}</div>
        <p className="timeStamp h-item">{dateString}</p>
      </div>
      {message.contentId === "Text" ? (
        <p>
          {message.content}
          {message.wasModified ? <i>&nbsp;(bearbeitet)</i> : null}
        </p>
      ) : null}
      {message.contentId === "Image" ? (
        <img className="image" alt="bild" src={message.content} />
      ) : null}
      {message.contentId === "Empty" ? <p>{message.content}</p> : null}
      {message.contentId === "DELETED" ? (
        <p>
          <i>(gelöscht)</i>
        </p>
      ) : null}
    <ul className="actionList">
      {authenticated && message.contentId != "DELETED" ? 
        <li>
          <a
            className="deleteButton"
            href={`/${message.thread.threadGroup.caption}/${message.thread.caption}/quoteMessage/${message.id}`}
          >
            <i className="fas fa-arrow-turn-down"></i>
          </a>
        </li>
      : null}
      {(authenticated &&
      (isSender || isModerator) &&
      message.contentId !== "DELETED") ? <>
        {isSender && message.contentId === "Text" ? <>
         <li>
               <a
                 className="deleteButton"
                 href={`/${message.thread.threadGroup.caption}/${message.thread.caption}/editMessage/${message.id}`}
               >
                 <i className="fas fa-pen"></i>
               </a>
             </li> 
        </>:null}
        <li>
          <a href="#" className="deleteButton" onClick={onDeleteMessage}>
              <i className="fas fa-trash"></i>
          </a>
        </li>
      </>: null}
      </ul>
    </div>
  );
}
