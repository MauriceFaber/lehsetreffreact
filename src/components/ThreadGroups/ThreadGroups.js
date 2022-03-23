import React from "react";
import ThreadGroup from "./ThreadGroup";
import { Link } from "react-router-dom";
import "./ThreadGroups.css";

export default function ThreadGroups({ groups }) {
  return groups.map((group) => {
    const key = `threadGroup_${group.id}`;
    return (
      <Link
        key={key}
        className="noLink"
        to={`/threadGroups/${group.caption.toLowerCase()}`}
      >
        <ThreadGroup threadGroup={group} />
      </Link>
    );
  });
}
