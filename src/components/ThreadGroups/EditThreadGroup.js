import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/Authentication";
import { useParams } from "react-router";
import { domain } from "../../App";

import "./ThreadGroups.css";

export default function AddThreadGroup({ editThreadGroup }) {
  const { groupId } = useParams();
  const [message, setMessage] = useState("");
  const { user, authenticated } = useAuth();

  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit() {
    let result = await editThreadGroup(groupId, caption, description);
    setMessage(result ? "" : "Konnte nicht bearbeitet werden.");
    if (result) {
      window.location.href = "/";
    }
  }

  function goBack() {
    window.location.href = "/";
  }

  async function loadGroup(id) {
    let result = await fetch(new Request(domain + "/threadGroups?id=" + id));
    if (result.ok) {
      return await result.json();
    }
    return undefined;
  }

  useEffect(async () => {
    var group = await loadGroup(groupId);
    if (group) {
      setCaption(group.caption);
      setDescription(group.description);
    }
  }, []);

  return (
    <div className="login-wrapper">
      <h2 className="formHeadline">Thread-Gruppe bearbeiten</h2>

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
