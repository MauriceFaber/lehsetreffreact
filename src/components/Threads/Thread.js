import React from "react";
import "./Threads.css";

export default function ThreadGroup(thread) {
  return (
    <div className="threadContainer">
      <h2>{thread.thread.caption}</h2>
      <p>{thread.thread.description}</p>
    </div>
  );
}
