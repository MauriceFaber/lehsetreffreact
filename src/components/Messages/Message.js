import React from "react";
import "./Messages";

export default function Message({ message }) {
  const date = new Date(message.timeStamp);
  const dateString = date.toLocaleString("de-DE");

  return (
    <div className="messageContainer">
      <div className="senderInformation">
        <a
          className="senderName h-item"
          href={`/profiles/${message.sender.id}`}
        >
          {message.senderName}
        </a>
        <div className="userRole h-item">{message.sender.role}</div>
        <p className="timeStamp h-item">{dateString}</p>
      </div>
      {message.contentId == "Text" ? <p>{message.content}</p> : null}
      {message.contentId == "Image" ? (
        <img className="image" src={message.content} />
      ) : null}
    </div>
  );
}
