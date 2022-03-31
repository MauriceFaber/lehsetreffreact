import React, { useEffect } from "react";
import Thread from "./Thread";
import "./Threads.css";
import { useState } from "react";
import { useParams } from "react-router";
import { domain } from "../../App";
import { useAuth } from "../../contexts/Authentication";
import Breadcrumb from "../Breadcrumb/Breadcrumb";

/**
 *
 * @param {Function} deleteThread
 * Loeschen des Threads.
 * @returns
 */
export default function Threads({ deleteThread }) {
  const { groupName } = useParams();
  const [group, setGroup] = useState();
  const [threads, setThreads] = useState();

  const { authenticated, isUser } = useAuth();

  useEffect(async () => {
    await loadThreadGroup(groupName);
  }, []);

  useEffect(async () => {
    if (group) {
      await loadThreads(groupName);
    }
  }, [group]);

  async function onDeleteThread(thread) {
    await deleteThread(thread);
    await loadThreadGroup(groupName);
  }

  /**
   * Laedt die Thread Gruppe.
   * @param {string} groupName
   * Der Name der Thread Gruppe.
   */
  async function loadThreadGroup(groupName) {
    let request = new Request(
      domain + "/threadGroups?groupName=" + encodeURIComponent(groupName)
    );
    let data = await fetch(request);
    data = await data.json();
    document.title = groupName;
    setGroup(data);
  }

  /**
   * Ruft die Threads der Gruppe ab.
   * @param {string} groupName
   * Der Name der Thread Gruppe.
   */
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
        {threads && threads.length === 0 ? (
          <p className="noMessagesWarning">Noch keine Threads vorhanden.</p>
        ) : null}
        {!threads ? (
          <div className="centered-loader">
            <div className="lds-ellipsis">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex-container wrap">
        {threads
          ? threads.map((thread, index) => {
              const key = `thread_${thread.id}`;
              return (
                <Thread
                  className="flex-item"
                  key={key}
                  thread={thread}
                  deleteThread={onDeleteThread}
                />
              );
            })
          : null}
      </div>
      {authenticated && isUser ? (
        <a href={`/${groupName}/addThread`} className="addButton">
          <i className="fa fa-plus"></i>
        </a>
      ) : null}
    </>
  );
}
