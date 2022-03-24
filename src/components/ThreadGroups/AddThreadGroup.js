import React, { useState } from "react";
import { useAuth } from "../../contexts/auth";

export default function AddThreadGroup({ addThreadGroup }) {
  const { user, authenticated } = useAuth();
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    let result = await addThreadGroup(caption, description);
    setMessage(result ? "" : "Konnte nicht hinzugefügt werden.");
    if (result) {
      window.location.href = "/";
    }
  }

  return (
    <div className="login-wrapper">
      <h2 className="formHeadline">Thread-Gruppe erstellen</h2>

      <form onSubmit={handleSubmit}>
        <h4>Name</h4>
        <input onChange={(e) => setCaption(e.target.value)} type="text"></input>
        <h4>Beschreibung</h4>
        <input
          onChange={(e) => setDescription(e.target.value)}
          type="text"
        ></input>
        <span className="danger">{message}</span>
        <input
          className="submitButton"
          type="button"
          onClick={handleSubmit}
          value="Hinzufügen"
        ></input>
      </form>
    </div>
  );
}
