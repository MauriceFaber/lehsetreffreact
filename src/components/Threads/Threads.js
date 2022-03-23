import React, { useEffect } from "react";
import Thread from "./Thread";
import "./Threads.css";
import { useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { domain } from "../../App";

export default function Threads() {
  const { groupName } = useParams();
  const [threads, setThreads] = useState([]);

  useEffect(async () => {
    await loadThreads(groupName);
  }, []);

  async function loadThreads(groupName) {
    let request = new Request(domain + "/threads?threadGroupName=" + groupName);
    let data = await fetch(request);
    data = await data.json();
    document.title = groupName;
    setThreads(data);
  }

  if (threads.length == 0) {
    return <div>Keine Threads vorhanden.</div>;
  }

  return (
    <>
      <h2>{threads.length > 0 ? threads[0].threadGroup.caption : ""}</h2>
      {threads.map((thread, index) => {
        const key = `thread_${thread.id}`;
        return (
          <Link
            key={key}
            className="noLink"
            to={`/threads/${thread.caption.toLowerCase()}`}
          >
            <Thread key={key} thread={thread} />
          </Link>
        );
      })}
    </>
  );
}
