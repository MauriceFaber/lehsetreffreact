import React from "react";
import { useAuth } from "../../contexts/Authentication";
import "./Login.css";
import { useState } from "react";

/**
 * Ruft den Dialog zum Login ab.
 * @returns
 * Die Login Ansicht.
 */
export default function Login() {
  const [username, setUserName] = useState(null);
  const [password, setPassword] = useState(null);
  const [message, setMessage] = useState("");
  const { authenticated, signIn, register } = useAuth();

  /**
   * Abfrage des Login.
   */
  async function handleSubmit() {
    const loggedIn = await signIn(username, password);
    if (!loggedIn) {
      setMessage("Fehler bei der Anmeldung.");
    }
  }

  /**
   * Abfrage der Registrierung.
   */
  async function handleRegister() {
    const loggedIn = await register(username, password);
    if (!loggedIn) {
      setMessage("Fehler bei der Registrierung.");
    }
  }

  if (authenticated) {
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

      <div onKeyDown={handleKeyDown} className="formContainer">
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
        <div className="formButtons">
          <input
            className="submitButton"
            type="button"
            onClick={handleSubmit}
            value="Anmelden"
          ></input>

          <input
            className="submitButton btn-danger"
            type="button"
            onClick={handleRegister}
            value="Registrieren"
          ></input>
        </div>
      </div>
    </div>
  );
}
