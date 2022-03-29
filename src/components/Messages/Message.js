import React from "react";
import "./Messages";

export default function Message({ message, index }) {
  const date = new Date(message.timeStamp);
  const dateString = date.toLocaleString("de-DE");
  return (
    <div className={`messageContainer ${index == 0 ? "firstMessage" : ""}`}>
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
    </div>
  );
}
