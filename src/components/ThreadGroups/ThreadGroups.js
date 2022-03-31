import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/Authentication";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import ThreadGroup from "./ThreadGroup";
import "./ThreadGroups.css";
import "../Loader/Loader.css";

/**
 * Liefert die Darstellung der ThreadGruppen.
 * @param groups
 * Enthaelt die Thread Gruppen.
 * @param {Function} deleteThreadGroup
 * Loeschen der Thread Gruppe.
 * @returns
 * Darstellung der Threadgruppen.
 */
export default function ThreadGroups({ groups, deleteThreadGroup }) {
  const { user, authenticated, isModerator } = useAuth();

  return (
    <div>
      <Breadcrumb />
      {groups && groups.length === 0 ? (
        <p className="noMessagesWarning">Noch keine Threads vorhanden.</p>
      ) : null}
      <div className="flex-container wrap">
        {groups ? (
          groups.map((group) => {
            const key = `threadGroup_${group.id}`;
            return (
              <ThreadGroup
                className="flex-item"
                key={key}
                threadGroup={group}
                deleteThreadGroup={deleteThreadGroup}
              />
            );
          })
        ) : (
          <div className="centered-loader">
            <div className="lds-ellipsis">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}
      </div>
      {authenticated && isModerator ? (
        <a href="/addThreadGroup" className="addButton">
          <i className="fa fa-plus"></i>
        </a>
      ) : null}
    </div>
  );
}
