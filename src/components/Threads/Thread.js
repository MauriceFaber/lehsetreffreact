import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/Authentication";
import "./Threads.css";
import "../ThreadGroups/ThreadGroups.css";

export default function ThreadGroup({ thread, deleteThread }) {
  const { user, authenticated } = useAuth();
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

  return (
    <div className="threadGroupContainer">
      <Link
        className="noLink"
        to={`/${thread.threadGroup.caption}/${thread.caption}`}
      >
        <h2>{thread.caption}</h2>
      </Link>
      <h5>Besitzer: {thread.owner.userName}</h5>
      <p>{thread.description}</p>
      {isOwner ? (
        <ul className="actionList">
          <li>
            <a
              className="deleteButton"
              href={`/${thread.threadGroup.caption}/editThread/${thread.id}`}
            >
              <i className="fas fa-pen"></i>
            </a>
          </li>
          <li>
            <a className="deleteButton" onClick={onDeleteThread}>
              <i className="fas fa-trash"></i>
            </a>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
