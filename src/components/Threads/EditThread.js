import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { domain } from "../../App";

/**
 * Dialog zum bearbeiten eines Threads.
 * @param {Function} editThread
 * Bearbeiten des Threads.
 * @returns
 * Ansicht, um Thread zu bearbeiten.
 */
export default function AddThreadGroup({ editThread }) {
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [message, setMessage] = useState("");
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");

  /**
   * Behandlung der Abfrage.
   */
  async function handleSubmit() {
    let result = await editThread(threadId, caption, description);
    setMessage(result ? "" : "Konnte nicht bearbeitet werden.");
    if (result) {
      window.location.href = "/" + thread.threadGroup.caption;
    }
  }

  function goBack() {
    window.location.href = "/" + thread.threadGroup.caption;
  }

  /**
   * Laedt den Thread.
   * @param {index} id
   * Die ID des Threads.
   * @returns
   * Erfolg oder Misserfolg.
   */
  async function loadThread(id) {
    let result = await fetch(new Request(domain + "/threads?threadId=" + id));
    if (result.ok) {
      return await result.json();
    }
    return undefined;
  }

  useEffect(async () => {
    var tmp = await loadThread(threadId);
    setThread(tmp);
    setCaption(tmp.caption);
    setDescription(tmp.description);
  }, []);

  return (
    <div className="login-wrapper">
      <h2 className="formHeadline">Thread bearbeiten</h2>

      <div className="formContainer">
        <h4>Name</h4>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        ></input>
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
            value="Speichern"
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
