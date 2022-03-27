import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { domain } from "../../App";

export default function AddThreadGroup({ editThread }) {
  const { threadId } = useParams();
  const [thread, setThread] = useState(null);
  const [message, setMessage] = useState("");
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit() {
    let result = await editThread(threadId, caption, description);
    console.log(result);
    setMessage(result ? "" : "Konnte nicht bearbeitet werden.");
    if (result) {
      window.location.href = "/" + thread.threadGroup.caption;
    }
  }

  function goBack() {
    window.location.href = "/" + thread.threadGroup.caption;
  }

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
    setCaption(thread.caption);
    setDescription(thread.description);
  }, []);

  return (
    <div className="login-wrapper">
      <h2 className="formHeadline">Thread bearbeiten</h2>

      <form onSubmit={handleSubmit}>
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
      </form>
    </div>
  );
}
