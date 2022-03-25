import React from "react";
import { useAuth } from "../../contexts/Authentication";
import "./Login.css";
import { useState } from "react";

export default function Login() {
  const [username, setUserName] = useState(null);
  const [password, setPassword] = useState(null);
  const [message, setMessage] = useState("");
  const { authenticated, signIn } = useAuth();

  async function handleSubmit() {
    const loggedIn = await signIn(username, password);
    console.log(loggedIn);
    if (!loggedIn) {
      setMessage("Fehler bei der Anmeldung.");
    }
  }

  if (authenticated) {
    console.log("authenticated");
    window.location.href = "/";
  }

  async function handleKeyDown(e) {
    if (e.key === "Enter") {
      await handleSubmit();
    }
  }

  return (
    <div className="login-wrapper">
      <h2 className="formHeadline">Anmelden</h2>

      <form onKeyDown={handleKeyDown} onSubmit={handleSubmit}>
        <h4>Benutzername</h4>
        <input
          onChange={(e) => setUserName(e.target.value)}
          type="text"
        ></input>
        <h4>Passwort</h4>
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        ></input>
        <span className="danger">{message}</span>
        <input
          className="submitButton"
          type="button"
          onClick={handleSubmit}
          value="Anmelden"
        ></input>
      </form>
    </div>
  );
}
