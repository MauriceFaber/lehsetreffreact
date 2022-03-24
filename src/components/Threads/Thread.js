import React from "react";
import "./Threads.css";

export default function ThreadGroup({ thread }) {
  console.log(thread.caption, thread.id);
  return (
    <div className="threadContainer">
      <h2>{thread.caption}</h2>
      <p>{thread.description}</p>
    </div>
  );
}
