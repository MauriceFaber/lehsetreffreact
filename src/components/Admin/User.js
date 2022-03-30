import React, { useState, useEffect } from "react";
import { domain } from "../../App";
import { useAuth } from "../../contexts/Authentication";
import "./RightsManagement.css";

export default function User({ currentUser }) {
  const { user } = useAuth();

  const [roleId, setRoleId] = useState(-1);

  const [isGuest, setIsGuest] = useState(true);
  const [isUser, setIsUser] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsGuest(["Guest", "User", "Mod", "Admin"].includes(currentUser.role));
    setIsUser(["User", "Mod", "Admin"].includes(currentUser.role));
    setIsModerator(["Mod", "Admin"].includes(currentUser.role));
    setIsAdmin(["Admin"].includes(currentUser.role));
  }, []);

  function getRoleId(roleName) {
    return ["Guest", "User", "Mod", "Admin"].indexOf(roleName);
  }

  useEffect(() => {
    setIsUser(currentUser.role == "User");
    setIsModerator(currentUser.role == "Mod");
    setIsAdmin(currentUser.role == "Admin");

    setRoleId(getRoleId(currentUser.role));
  }, []);

  async function setRole(newRole) {
    let request = new Request(domain + "/userRole", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `apiKey=${user.apiKey}&userId=${currentUser.id}&roleId=${newRole}`,
    });
    let result = await fetch(request);
    if (result.ok) {
      setRoleId(newRole);
    } else {
      alert("Fehler beim Senden.");
    }
  }

  return (
    <div className="roleContainer">
      <h4>{currentUser.userName}</h4>
      <img className="avatar" src={currentUser.avatar} />
      <select className="roleSelect" onChange={(e) => setRole(e.target.value)}>
        <option value="0" selected={isGuest}>
          Gast
        </option>
        <option value="1" selected={isUser}>
          Benutzer
        </option>
        <option value="2" selected={isModerator}>
          Moderator
        </option>
        <option value="3" selected={isAdmin}>
          Admin
        </option>
      </select>
    </div>
  );
}
