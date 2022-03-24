import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/auth";
import User from "./User";

import "./RightsManagement.css";
import "./../Loader/Loader.css";

import { domain } from "../../App";

export default function RightsManagement() {
  const { user, authenticated } = useAuth();
  const [users, setUsers] = useState([]);

  let userIdAvatarDic = {};

  async function getAvatar(id) {
    if (userIdAvatarDic[id]) {
      return userIdAvatarDic[id];
    } else {
      let request = new Request(domain + `/users?id=${id}`);
      let data = await fetch(request);
      data = await data.json();

      userIdAvatarDic[id] = data.avatar;
      return data.avatar;
    }
  }

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
