import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/Authentication";
import { useParams } from "react-router";
import { domain } from "../../App";

import "../ThreadGroups/ThreadGroups.css";

export default function QuoteMessage({quoteMessage}) {

    const { messageId } = useParams();
    const [warning, setWarning] = useState("");
    const [text, setText] = useState("");
    const [quotedMessage, setQuotedMessage] = useState(null);


    function goBack() {
        window.location.href = `/${quotedMessage.thread.threadGroup.caption}/${quotedMessage.thread.caption}`;
      }
    
      async function loadMessage(messageId) {
        let result = await fetch(new Request(domain + "/messages?messageId=" + messageId));
        if (result.ok) {
        
        let tmp = await result.json();
        return tmp;
    
        }
        return undefined;
      }
    
      async function handleSubmit() {
        let result = await quoteMessage(text, quotedMessage.id, quotedMessage.thread.id);
        setWarning(result ? "" : "Kann nicht zitiert werden werden.");
        if (result) {
          window.location.href = `/${quotedMessage.thread.threadGroup.caption}/${quotedMessage.thread.caption}`;
        }
      }

      useEffect(async () => {
        var loadedMessage = await loadMessage(messageId);
        setQuotedMessage(loadedMessage);
      }, []);

      

  return (
    <div className="login-wrapper">
      <h2 className="formHeadline">Zitat</h2>

      <form onSubmit={handleSubmit}>
        <div>
             <p>Du zitierst {quotedMessage?.sender.userName}:</p>
             <p><i>"{quotedMessage?.content}"</i></p>
            
        </div>
        
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
            value="Senden"
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
  )
}
