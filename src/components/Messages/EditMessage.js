import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/Authentication";
import { useParams } from "react-router";
import { domain } from "../../App";

import "../ThreadGroups/ThreadGroups.css";

/**
 * Liefert ein Fenster zum Editieren der Nachricht.
 * @param {Number} editMessage
 * Id der zu editierenden Nachricht.
 * @returns
 * Fenster zum Editieren einer Nachricht.
 */
export default function EditMessage({ editMessage }) {
  const { messageId } = useParams();
  const [warning, setWarning] = useState("");
  const [text, setText] = useState("");
  const [message, setMessage] = useState(null);

  /**
   * Springt zu der vorherigen Seite zurück nach Abbruch der Editierung.
   */
  function goBack() {
    window.location.href = `/${message.thread.threadGroup.caption}/${message.thread.caption}`;
  }
  /**
   * Lädt eine Nachricht.
   * @param {Number} messageId
   * Id der Nachricht.
   * @returns
   * Json der Nachricht.
   */
  async function loadMessage(messageId) {
    let result = await fetch(
      new Request(domain + "/messages?messageId=" + messageId)
    );
    if (result.ok) {
      let tmp = await result.json();
      return tmp;
    }
    return undefined;
  }

  /**
   * Editiert die Nachricht und springt zur vorherigen Seite zurück.
   */
  async function handleSubmit() {
    let result = await editMessage(messageId, text, 0);
    setWarning(result ? "" : "Konnte nicht bearbeitet werden.");
    if (result) {
      window.location.href = `/${message.thread.threadGroup.caption}/${message.thread.caption}`;
    }
  }

  useEffect(async () => {
    var message = await loadMessage(messageId);
    setMessage(message);
    if (message) {
      setText(message.content);
    }
  }, []);

  //Liefert eine Seite zum Editieren der Nachricht zurück.
  return (
    <div className="login-wrapper">
      <h2 className="formHeadline">Nachricht bearbeiten</h2>

      <div className="formContainer">
        <textarea
          className="description-text"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <span className="danger">{warning}</span>
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
