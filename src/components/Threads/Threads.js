import React, { useEffect } from "react";
import Thread from "./Thread";
import "./Threads.css";
import { useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { domain } from "../../App";

export default function Threads() {
  const { groupId } = useParams();
  const [threads, setThreads] = useState([]);

  useEffect(async () => {
    await loadThreads(groupId);
  }, []);

  async function loadThreads(groupId) {
    // let request = new Request(domain + "/threads?threadGroupID=" + groupId);
    // let data = await fetch(request);
    // console.log(data);
    // data = await data.json();
    // setThreads(data);
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
          <Link key={key} className="noLink" to={`/messages/${thread.id}`}>
            <Thread key={key} thread={thread} />
          </Link>
        );
      })}
    </>
  );
}
