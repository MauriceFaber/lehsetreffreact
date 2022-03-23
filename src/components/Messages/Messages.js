import React, { useEffect } from "react";
import Message from "./Message";
import { useState } from "react";
import "./Messages.css";
import { useParams } from "react-router";
import { domain } from "../../App";

export default function Messages() {
  const { threadName } = useParams();
  const [messages, setMessages] = useState([]);

  useEffect(async () => {
    await loadMessages(threadName);
  }, []);

  async function loadMessages(threadName) {
    let request = new Request(domain + "/messages?threadName=" + threadName);
    let data = await fetch(request);
    data = await data.json();
    document.title = threadName;
    setMessages(data);
  }

  if (messages.length == 0) {
    return <div>Keine Nachrichten vorhanden.</div>;
  }

  return (
    <>
      <h2>{messages.length > 0 ? messages[0].thread.caption : ""}</h2>

      {messages.map((message, index) => {
        const key = `message_${message.id}`;
        return <Message key={key} message={message} />;
      })}
    </>
  );
}
