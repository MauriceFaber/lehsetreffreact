import React, { useEffect } from "react";
import Thread from "./Thread";
import "./Threads.css";
import { useState } from "react";
import { useParams } from "react-router";
import { domain } from "../../App";
import { useAuth } from "../../contexts/Authentication";
import Breadcrumb from "../Breadcrumb/Breadcrumb";

export default function Threads({ deleteThread }) {
  const { groupName } = useParams();
  const [threads, setThreads] = useState([]);
  const { username } = useAuth();

  const { user, authenticated } = useAuth();
  const [isModerator, setModerator] = useState(false);

  useEffect(() => {
    if (!authenticated) {
      setModerator(false);
    } else {
      setModerator(["Moderator", "Admin"].includes(user.role));
    }
  }, [authenticated]);

  useEffect(async () => {
    await loadThreads(groupName);
  }, []);

  async function onDeleteThread(thread) {
    await deleteThread(thread);
    await loadThreads(groupName);
  }

  async function loadThreads(groupName) {
    let request = new Request(domain + "/threads?threadGroupName=" + groupName);
    let data = await fetch(request);
    data = await data.json();
    document.title = groupName;
    setThreads(data);
  }

  let isOwner = false;

  if (threads.length > 0) {
    isOwner = threads[0].threadGroup.owner.userName == username;
  }

  return (
    <>
      <div className="headSection">
        <Breadcrumb groupName={groupName} />
        <h3>{threads.length > 0 ? threads[0].threadGroup.caption : ""}</h3>
        <p>
          <i>{threads.length > 0 ? threads[0].threadGroup.description : ""}</i>
        </p>
      </div>
      {isOwner ? <h3>Hi Besitzer!</h3> : null}
      {threads.map((thread, index) => {
        const key = `thread_${thread.id}`;
        return (
          <Thread key={key} thread={thread} deleteThread={onDeleteThread} />
        );
      })}

      {authenticated && isModerator ? (
        <a href={`/${groupName}/addThread`} className="addButton">
          <i className="fa fa-plus"></i>
        </a>
      ) : null}
    </>
  );
}
