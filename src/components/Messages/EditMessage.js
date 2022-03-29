import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/Authentication";
import { useParams } from "react-router";
import { domain } from "../../App";

import "../ThreadGroups/ThreadGroups.css";

export default function EditMessage({editMessage}) {

    const { messageId } = useParams();
    const [warning, setWarning] = useState("");
    const [text, setText] = useState("");
    const [message, setMessage] = useState(null);

    function goBack() {
        window.location.href = `/${message.thread.threadGroup.caption}/${message.thread.caption}`;
      }

      async function loadMessage(messageId) {
        let result = await fetch(new Request(domain + "/messages?messageId=" + messageId));
        if (result.ok) {
        
        let tmp = await result.json();
        console.log(tmp);
        return tmp;

        }
        return undefined;
      }

      async function handleSubmit() {
        let result = await editMessage(messageId, text, 0);
        setWarning(result ? "" : "Konnte nicht bearbeitet werden.");
        if (result) {
          window.location.href = `/${message.thread.threadGroup.caption}/${message.thread.caption}`;
        }
      }

    async function onEditMessage() {
        
        const result = await editMessage(messageId);
        if (!result) {
            alert("Fehler beim Ändern der Nachricht.");
        }
      }

      useEffect(async () => {
        var message = await loadMessage(messageId);
        setMessage(message);
        if (message) {
          setText(message.content);
        }
      }, []);




  return (
    <div className="login-wrapper">
      <h2 className="formHeadline">Nachricht bearbeiten</h2>

      <form onSubmit={handleSubmit}>
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
      </form>
    </div>
  );
}
