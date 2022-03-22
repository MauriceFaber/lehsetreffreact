import React from "react";
import "./Messages";

export default function Message(message) {
  return (
    <div className="messageContainer">
      <p>{message.message.senderName}</p>
      <p>{message.message.timeStamp}</p>
      <p>{message.message.contentId}</p>
      <p>
        <b>{message.message.content}</b>
      </p>
    </div>
  );
}
