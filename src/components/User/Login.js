import React from "react";
import { useAuth } from "../../contexts/auth";
import "./Login.css";
import { useState } from "react";

export default function Login() {
  const [username, setUserName] = useState(null);
  const [password, setPassword] = useState(null);
  const { authenticated, signIn } = useAuth();

  async function handleSubmit() {
    console.log(username, password);
    await signIn(username, password);
  }

  if (authenticated) {
    console.log("authenticated");
    window.location.href = "/";
  }

  return (
    <div className="login-wrapper">
      <h1>Anmelden oder Registrieren</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Benutzername
          <input
            onChange={(e) => setUserName(e.target.value)}
            type="text"
          ></input>
        </label>
        <label>
          Passwort
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          ></input>
        </label>
        <input type="button" onClick={handleSubmit} value="Anmelden"></input>
      </form>
    </div>
  );
}
