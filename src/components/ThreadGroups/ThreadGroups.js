import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/Authentication";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import ThreadGroup from "./ThreadGroup";
import "./ThreadGroups.css";

export default function ThreadGroups({ groups, deleteThreadGroup }) {
  const { user, authenticated } = useAuth();
  const [isModerator, setModerator] = useState(false);

  useEffect(() => {
    if (!authenticated) {
      setModerator(false);
    } else {
      setModerator(["Mod", "Admin"].includes(user.role));
    }
  }, [authenticated]);

  return (
    <div className="mainDiv">
      <Breadcrumb />
      {groups.map((group) => {
        const key = `threadGroup_${group.id}`;
        return (
          <ThreadGroup
            key={key}
            threadGroup={group}
            deleteThreadGroup={deleteThreadGroup}
          />
        );
      })}
      {authenticated && isModerator ? (
        <a href="/addThreadGroup" className="addButton">
          <i className="fa fa-plus"></i>
        </a>
      ) : null}
    </div>
  );
}
