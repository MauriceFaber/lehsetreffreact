import React, { useState } from "react";
import { useAuth } from "../../contexts/Authentication";

/**
 * Darstellung eines Dialoges zum Erstellen einer ThreadGruppe
 * @param {Function} addThreadGroup
 * Methode zum Hinzufügen des Threads
 * @returns
 * Ansicht, um Thread Gruppe zu erstellen.
 */
export default function AddThreadGroup({ addThreadGroup }) {
  const { user, authenticated } = useAuth();
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  /**
   * Behandlung der Abfrage.
   */
  async function handleSubmit() {
    let result = await addThreadGroup(caption, description);
    setMessage(result ? "" : "Konnte nicht hinzugefügt werden.");
    if (result) {
      window.location.href = "/";
    }
  }
  function goBack() {
    window.location.href = "/";
  }

  return (
    <div className="login-wrapper">
      <h2 className="formHeadline">Thread-Gruppe erstellen</h2>

      <div className="formContainer">
        <h4>Name</h4>
        <input onChange={(e) => setCaption(e.target.value)} type="text"></input>
        <h4>Beschreibung</h4>
        <textarea
          className="description-text"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <span className="danger">{message}</span>

        <div className="formButtons">
          <input
            className="submitButton"
            type="button"
            onClick={handleSubmit}
            value="Hinzufügen"
          ></input>

          <input
            className="submitButton btn-danger"
            type="button"
            onClick={goBack}
            value="Abbrechen"
          ></input>
        </div>
      </div>
    </div>
  );
}
