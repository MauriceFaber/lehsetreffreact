import React from "react";
import ThreadGroup from "./ThreadGroup";
import { Link } from "react-router-dom";
import "./ThreadGroups.css";

export default function ThreadGroups(params) {
  return params.params.map((group) => {
    const key = `threadGroup_${group.id}`;
    return (
      <Link key={key} className="noLink" to={`/threads/${group.id}`}>
        <ThreadGroup threadGroup={group} />
      </Link>
    );
  });
}
