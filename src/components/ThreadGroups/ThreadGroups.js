import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/Authentication";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import ThreadGroup from "./ThreadGroup";
import "./ThreadGroups.css";

/**
 *
 * @param groups
 * Enthaelt die Thread Gruppen.
 * @param {Function} deleteThreadGroup
 * Loeschen der Thread Gruppe.
 * @returns
 *
 */
export default function ThreadGroups({ groups, deleteThreadGroup }) {
  const { user, authenticated, isModerator } = useAuth();

  return (
    <div>
      <Breadcrumb />
      <div className="flex-container wrap">
        {groups.map((group) => {
          const key = `threadGroup_${group.id}`;
          return (
            <ThreadGroup
              className="flex-item"
              key={key}
              threadGroup={group}
              deleteThreadGroup={deleteThreadGroup}
            />
          );
        })}
      </div>
      {authenticated && isModerator ? (
        <a href="/addThreadGroup" className="addButton">
          <i className="fa fa-plus"></i>
        </a>
      ) : null}
    </div>
  );
}
