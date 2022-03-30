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
  const [group, setGroup] = useState();
  const [threads, setThreads] = useState([]);

  const { authenticated, isUser } = useAuth();

  useEffect(async () => {
    await loadThreadGroup(groupName);
  }, []);

  useEffect(async () => {
    if (group) {
      await loadThreads(groupName);
    } else {
      setThreads([]);
    }
  }, [group]);

  async function onDeleteThread(thread) {
    await deleteThread(thread);
    await loadThreadGroup(groupName);
  }

  async function loadThreadGroup(groupName) {
    let request = new Request(
      domain + "/threadGroups?groupName=" + encodeURIComponent(groupName)
    );
    let data = await fetch(request);
    data = await data.json();
    document.title = groupName;
    setGroup(data);
  }

  async function loadThreads(groupName) {
    let request = new Request(
      domain + "/threads?threadGroupName=" + encodeURIComponent(groupName)
    );
    let data = await fetch(request);
    data = await data.json();
    document.title = groupName;
    setThreads(data);
  }

  return (
    <>
      <div className="headSection">
        <Breadcrumb groupName={groupName} />
        <h3>{group?.caption}</h3>
        <pre className="block">
          <i>{group?.description}</i>
        </pre>
      </div>

      {threads.map((thread, index) => {
        const key = `thread_${thread.id}`;
        return (
          <Thread key={key} thread={thread} deleteThread={onDeleteThread} />
        );
      })}

      {authenticated && isUser ? (
        <a href={`/${groupName}/addThread`} className="addButton">
          <i className="fa fa-plus"></i>
        </a>
      ) : null}
    </>
  );
}
