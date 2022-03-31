import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/Authentication";
import "./Threads.css";
import "../ThreadGroups/ThreadGroups.css";
import { trimMax } from "../ThreadGroups/ThreadGroup";

/**
 * Ruft den Thread ab.
 * @param {Function} thread
 * Der Thread.
 * @param {Function} deleteThread
 * Loeschen des Threads.
 * @returns
 * Ansicht des Threads.
 * Falls Besitzer oder Moderator, erzeuge Delete Button.
 */
export default function ThreadGroup({ thread, deleteThread }) {
  const { user, authenticated, isModerator, isUser } = useAuth();
  const [isOwner, setOwner] = useState(false);

  async function onDeleteThread() {
    await deleteThread(thread);
  }

  useEffect(() => {
    if (!user) {
      setOwner(false);
    } else {
      setOwner(thread.owner.id == user.id);
    }
  }, [authenticated]);

  thread.description = trimMax(thread.description, 100);

  return (
    <div className="threadGroupContainer">
      <Link
        className="noLink"
        to={`/${thread.threadGroup.caption}/${thread.caption}`}
      >
        <h3>{thread.caption}</h3>
      </Link>
      <h5>Besitzer: {thread.owner.userName}</h5>
      <p className="threadGroupDescription">{thread.description}</p>
      {isUser && (isOwner || isModerator) ? (
        <ul className="actionList">
          <li>
            <a
              className="deleteButton"
              href={`/${thread.threadGroup.caption}/editThread/${thread.id}`}
            >
              <i className="fas fa-pen"></i>
            </a>
          </li>
          {isModerator ? (
            <li>
              <a className="deleteButton" onClick={onDeleteThread}>
                <i className="fas fa-trash"></i>
              </a>
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
