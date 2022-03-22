import React from "react";
import "./ThreadGroups.css";

export default function ThreadGroup(group) {
  return (
    <div className="threadGroupContainer">
      <h2>{group.threadGroup.caption}</h2>
      <small>Besitzer: {group.threadGroup.owner.userName}</small>
      <br />
      <br />
      <p>
        <i>
          Beschreibung:
          <br />
          {group.threadGroup.description}
        </i>
      </p>
    </div>
  );
}
