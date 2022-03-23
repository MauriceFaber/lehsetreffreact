import React from "react";
import { useAuth } from "../../contexts/auth";

export default function Profile() {
  const { user } = useAuth();
  if (!user) {
    return null;
  }
  return (
    <div>
      <h1>Profil</h1>
      <br />
      <h2>{user.userName}</h2>
      <img src={user.avatar}></img>
      <p>ApiKey: {user.apiKey}</p>
    </div>
  );
}
