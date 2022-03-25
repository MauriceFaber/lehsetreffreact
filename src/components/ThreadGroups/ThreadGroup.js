import { useState, useEffect } from "react";
import React from "react";
import "./ThreadGroups.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/Auth";

export default function ThreadGroup({ threadGroup, deleteThreadGroup }) {
  const { user, authenticated } = useAuth();
  const [isOwner, setOwner] = useState(false);

  async function onDeleteThreadGroup() {
    await deleteThreadGroup(threadGroup);
  }

  useEffect(() => {
    if (!user) {
      setOwner(false);
    } else {
      setOwner(threadGroup.owner.id == user.id);
    }
  }, [authenticated]);

  const key = `threadGroupLink_${threadGroup.id}`;
  return (
    <div className="threadGroupContainer">
      <Link
        key={key}
        className="noLink"
        to={`/threadGroups/${threadGroup.caption.toLowerCase()}`}
      >
        <h2>{threadGroup.caption}</h2>
      </Link>
      <h5>Besitzer: {threadGroup.owner.userName}</h5>
      <br />
      <p className="threadGroupDescription">
        <i>{threadGroup.description}</i>
      </p>
      {isOwner ? (
        <ul className="actionList">
          <li>
            <a
              className="deleteButton"
              href={`/editThreadGroup/${threadGroup.id}`}
            >
              <i className="fas fa-pen"></i>
            </a>
          </li>
          <li>
            <a className="deleteButton" onClick={onDeleteThreadGroup}>
              <i className="fas fa-trash"></i>
            </a>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
