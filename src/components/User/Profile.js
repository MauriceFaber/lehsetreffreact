import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/Authentication";
import "./Profile.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { uploadImageFileSize } from "../Messages/Messages";
import { domain } from "../../App";

export default function Profile() {
  const { user, setAvatar } = useAuth();
  const [key, setKey] = useState("");

  useEffect(() => {
    if (user) {
      setKey(user.apiKey);
    }
  }, [user]);

  const [fileInput, setFileInput] = useState(undefined);
  /**
   * Handler zum Öffnen einer Datei
   */
  function handleOpen() {
    fileInput.click();
  }

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

  /**
   * Ruft das zusendente Bild ab und wandelt es in Base64 um
   * @param {Event} event
   * Auswahl der Datei
   */
  async function sendImage(event) {
    var file = event.target.files[0];

    if (file && file.type.match(/image.*/)) {
      var reader = new FileReader();
      reader.onload = function (readerEvent) {
        var image = new Image();
        image.onload = async function (imageEvent) {
          var canvas = document.createElement("canvas"),
            max_size = uploadImageFileSize,
            width = image.width,
            height = image.height;
          if (width > height) {
            if (width > max_size) {
              height *= max_size / width;
              width = max_size;
            }
          } else {
            if (height > max_size) {
              width *= max_size / height;
              height = max_size;
            }
          }
          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(image, 0, 0, width, height);
          var dataUrl = canvas.toDataURL("image/png");
          var result = await putAvatar(dataUrl);
          if (result) {
            await setAvatar(dataUrl);
          }
        };
        image.src = readerEvent.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async function putAvatar(base64) {
    let request = new Request(domain + "/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `apiKey=${user.apiKey}&avatar=${base64}`,
    });
    let result = await fetch(request);
    return result.ok;
  }

  if (!user) {
    return null;
  }
  return (
    <div>
      <h2>Profil</h2>
      <div className="profile">
        <img
          onClick={handleOpen}
          className="profileBigAvatar avatar"
          src={user.avatar}
        ></img>
        <h3 className="profile-name">{user.userName}</h3>

        <a href="#" onClick={alertCopied} className="noLink">
          Api Key kopieren&nbsp;
          <CopyToClipboard text={key}>
            <i className="fas fa-copy"></i>
          </CopyToClipboard>
        </a>

        <input
          ref={(input) => setFileInput(input)}
          className="hiddenDisplayNone"
          onChange={(e) => sendImage(e)}
          type="file"
        />

        <ToastContainer />
      </div>
    </div>
  );
}
