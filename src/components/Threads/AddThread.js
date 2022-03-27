import React, { useState } from "react";
import { useParams } from "react-router";

export default function AddThreadGroup({ addThread }) {
  const { groupName } = useParams();
  console.log(groupName);

  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    let result = await addThread(groupName, caption, description);
    setMessage(result ? "" : "Konnte nicht hinzugefügt werden.");
    if (result) {
      window.location.href = "/" + groupName;
    }
  }
  function goBack() {
    window.location.href = "/" + groupName;
  }

  return (
    <div className="login-wrapper">
      <h2 className="formHeadline">Thread erstellen</h2>

      <form onSubmit={handleSubmit}>
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
      </form>
    </div>
  );
}
