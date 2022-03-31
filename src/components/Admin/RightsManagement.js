import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/Authentication";
import User from "./User";

import "./RightsManagement.css";
import "./../Loader/Loader.css";
import "./../ThreadGroups/ThreadGroups.css";

import { domain } from "../../App";

/**
 * Ruft die Darstellung der Rechteverwaltung ab.
 * @returns
 * Darstellung der Rechteverwaltung.
 */
export default function RightsManagement() {
  const { user, authenticated } = useAuth();
  const [users, setUsers] = useState([]);

  /**
   * Lädt die ThreadGruppen und setzt die Benutzer.
   */
  async function reloadThreadGroups() {
    let request = new Request(
      domain +
        `/userRole?userMode=allUsers&withAvatars=true&apiKey=${user.apiKey}`
    );
    let data = await fetch(request);
    data = await data.json();
    setUsers(data);
  }

  useEffect(async () => {
    if (authenticated) {
      await reloadThreadGroups();
    }
  }, [authenticated]);

  //Zeige einen Ladekreis bis die Nutzer geladen sind
  if (!users.length) {
    return (
      <>
        <h1>Rechteverwaltung.</h1>
        <div className="centered-loader">
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </>
    );
  }

  //Listet alle Nutzer auf um die jeweiligen Rechte anzupassen
  return (
    <>
      <h1>Rechteverwaltung.</h1>
      <div className="flex-container wrap">
        {users.length > 0
          ? users.map((user) => {
              return (
                <User className="flex-item" key={user.id} currentUser={user} />
              );
            })
          : null}
      </div>
    </>
  );
}
