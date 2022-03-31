import { useState, useEffect } from "react";
import React from "react";
import "./ThreadGroups.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/Authentication";

export function trimMax(string, length) {
  return string.length > length ? string.substring(0, length) + "..." : string;
}

/**
 * Liefert die Darstellung einer ThreadGruppe zurück.
 * @param {Function} threadGroup
 * Die Thread Gruppe.
 * @param {Function} deleteThreadGroup
 * Loeschen der Thread Gruppe.
 * @returns
 * Ansicht der Thread Gruppe.
 * Falls Besitzer oder Moderator, erzeuge Delete/Edit Button.
 */
export default function ThreadGroup({ threadGroup, deleteThreadGroup }) {
  const { user, authenticated, isModerator, isUser } = useAuth();
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

  threadGroup.description = trimMax(threadGroup.description, 100);

  const key = `threadGroupLink_${threadGroup.id}`;
  return (
    <div className="threadGroupContainer">
      <Link key={key} className="noLink" to={`/${threadGroup.caption}`}>
        <h3>{threadGroup.caption}</h3>
      </Link>
      <h5>Besitzer: {threadGroup.owner.userName}</h5>
      <p className="threadGroupDescription">
        <i>{threadGroup.description}</i>
      </p>
      {(isOwner || isModerator) && isUser ? (
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
