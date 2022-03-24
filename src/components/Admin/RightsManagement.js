import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/auth";
import User from "./User";

import { domain } from "../../App";

export default function RightsManagement() {
  const { user, authenticated } = useAuth();
  const [users, setUsers] = useState([]);

  async function reloadThreadGroups() {
    let request = new Request(
      domain +
        `/userRole?userMode=allUsers&withAvatars=false&apiKey=${user.apiKey}`
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

  console.log(users);

  return (
    <>
      <h1>Rechteverwaltung.</h1>
      {users.length > 0
        ? users.map((user) => {
            return <User key={user.id} currentUser={user} />;
          })
        : null}
    </>
  );
}
