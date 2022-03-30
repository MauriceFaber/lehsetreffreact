import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/Authentication";
import "./Profile.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CopyToClipboard } from "react-copy-to-clipboard";

/**
 * Ruft das Nutzer Profil ab.
 * @returns 
 * Die Ansicht des Nutzer Profils.
 */
export default function Profile() {
  const { user } = useAuth();
  const [key, setKey] = useState("");

  useEffect(() => {
    if (user) {
      setKey(user.apiKey);
    }
  }, [user]);

  /**
   * Anzeige, falls ApiKey kopiert wird.
   */
  function alertCopied() {
    toast.success("ApiKey kopiert.", {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  if (!user) {
    return null;
  }
  return (
    <div>
      <h2>Profil</h2>
      <div className="profile">
        <img className="profileBigAvatar h-item avatar" src={user.avatar}></img>
        <h3 className="h-item profile-name">{user.userName}</h3>

        <a href="#" onClick={alertCopied} className="noLink">
          Api Key kopieren&nbsp;
          <CopyToClipboard text={key}>
            <i className="fas fa-copy"></i>
          </CopyToClipboard>
        </a>
        <ToastContainer />
      </div>
    </div>
  );
}
