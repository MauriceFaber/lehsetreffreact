import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import ThreadGroups from "./components/ThreadGroups/ThreadGroups";
import Threads from "./components/Threads/Threads";
import Messages from "./components/Messages/Messages";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import { useAuth } from "./contexts/Authentication";
import Profile from "./components/User/Profile";
import Login from "./components/User/Login";
import EditMessage from "./components/Messages/EditMessage";
import QuoteMessage from "./components/Messages/QuoteMessage";

import AddThreadGroup from "./components/ThreadGroups/AddThreadGroup";
import EditThreadGroup from "./components/ThreadGroups/EditThreadGroup";
import RightsManagement from "./components/Admin/RightsManagement";

import AddThread from "./components/Threads/AddThread";
import EditThread from "./components/Threads/EditThread";

// export const domain = "http://localhost:8080/lehsetreff";
export const domain = "https://octopi.mauricefaber.de";
// export const domain = "https://api.lehsetreff.de";

/**
 * 
 * @returns 
 * Liefert die einzelnen Pfade der benötigten Funktionen aus der App
 */
export default function App() {
  const [currentThreadGroups, setThreadGroups] = useState([]);
  const { user, authenticated, signInAutomatically, signIn, singOut } =
    useAuth();

  useEffect(() => {
    if (!authenticated) {
      signInAutomatically();
    }
  }, [signInAutomatically, authenticated]);

/**
 * Funktion zum Aktualisieren der Themengruppe
 */
  async function reloadThreadGroups() {
    const request = new Request(domain + "/threadGroups");
    let data = await fetch(request);
    data = await data.json();
    setThreadGroups(data);
  }

  useEffect(async () => {
    await reloadThreadGroups();
  }, []);

/**
 * Funktion zum Ausloggen
 */ 
  function logoutClicked() {
    singOut();
  }

/**
 * Funktion zum Löschen von Themengruppe mit vorheriger Abfrage
 * @param {*} group 
 * Auswahl der richtigen Gruppe
 * @returns 
 * Liefert löschen Abfrage zurück
 */
  async function deleteThreadGroup(group) {
    if (!window.confirm(`${group.caption} wirklich löschen?`)) {
      return;
    }
    let request = new Request(domain + "/threadGroups", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `apiKey=${user.apiKey}&id=${group.id}`,
    });

    await fetch(request)
      .then(async (returnedResponse) => {
        await reloadThreadGroups();
      })
      .catch((error) => {
        alert(error);
      });
  }
/**
 * Funktion zum Löschen von Themen
 * @param {*} thread 
 * Auswahl des richtigen Themas
 * @returns 
 * Liefert löschen Abfrage zurück
 */
  async function deleteThread(thread) {
    if (!window.confirm(`${thread.caption} wirklich löschen?`)) {
      return;
    }
    let request = new Request(domain + "/threads", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `apiKey=${user.apiKey}&threadId=${thread.id}`,
    });

    await fetch(request)
      .then(async (returnedResponse) => {
        await reloadThreadGroups();
      })
      .catch((error) => {
        alert(error);
      });
  }
/**
 * Funktion zum Hinzufügen einer Themengruppe
 * @param {*} caption 
 * Setzen der Überschrift
 * @param {*} description
 * Setzen der Überschrift 
 * @returns 
 * Liefert das Ergebnis der Erstellung der Themengruppe zurück
 */
  async function addThreadGroup(caption, description) {
    let request = new Request(domain + "/threadGroups", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `apiKey=${user.apiKey}&caption=${caption}&description=${description}`,
    });

    let result = await fetch(request);
    return result.ok;
  }
/**
 * Funktion zum Bearbeiten einer Themengruppe
 * @param {*} id 
 * Überprüfung der ID mit ApiKey
 * @param {*} caption 
 * Bearbeiten der Überschrift
 * @param {*} description 
 * Bearbeiten der Beschreibung
 * @returns 
 * Liefert die überarbeitete Überschrift und Beschreibung der Themengruppe zurück
 */
  async function editThreadGroup(id, caption, description) {
    let bodyArg = `apiKey=${user.apiKey}&id=${id}`;
    if (caption) {
      bodyArg += `&caption=${caption}`;
    }
    if (description) {
      bodyArg += `&description=${description}`;
    }
    let request = new Request(domain + "/threadGroups", {
      method: "PUT",
      body: bodyArg,
    });

    let result = await fetch(request);
    return result.ok;
  }
/**
 * Funktion zum Hinzufügen eines Themas
 * @param {*} groupName 
 * Gruppennamen setzen
 * @param {*} caption 
 * berschrift setzen
 * @param {*} description 
 * Beschreibung setzen
 * @returns 
 * Liefert das erstellte Thema zurück
 */
  async function addThread(groupName, caption, description) {
    let request = new Request(domain + "/threads", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `apiKey=${user.apiKey}&groupName=${groupName}&caption=${caption}&description=${description}`,
    });

    let result = await fetch(request);
    return result.ok;
  }
/**
 * Funktion zum Bearbeiten eines Themas
 * @param {*} id 
 * Überprüfung der ID mit ApiKey
 * @param {*} caption 
 * Überschrift setzen
 * @param {*} description 
 * Beschreibung setzen
 * @returns 
 * Liefert bearbeitetes Thema zurück
 */
  async function editThread(id, caption, description) {
    let bodyArg = `apiKey=${user.apiKey}&threadId=${id}`;
    if (caption) {
      bodyArg += `&caption=${caption}`;
    }
    if (description) {
      bodyArg += `&description=${description}`;
    }
    let request = new Request(domain + "/threads", {
      method: "PUT",
      body: bodyArg,
    });

    let result = await fetch(request);
    return result.ok;
  }
/**
 * Funktion zum Bearbeiten einer Nachricht
 * @param {*} messageId 
 * Überprüfung der Nachricht ID
 * @param {*} content 
 * Inhalt der Nachricht mitgeben
 * @param {*} type 
 * Überprüfung des Datentyps
 * @returns 
 * Liefert die erfolgreich bearbeitete Nachricht zurück
 */
  async function editMessage(messageId, content, type) {
    if (type != 0) {
      return false;
    }
    let request = new Request(domain + "/messages", {
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `apiKey=${user.apiKey}&messageID=${messageId}&content=${content}&contentType=${type}`,
    });
    let result = await fetch(request);

    return result.ok;
  }
/**
 * Funktion zum Zitieren einer einer Nachricht
 * @param {*} content 
 * Inhalt der Nachricht mitgeben
 * @param {*} quotedMessageId 
 * Überprüfung der Zitatnachricht ID
 * @param {*} threadId 
 * Überprüfung der Thema ID
 * @returns 
 * Liefert das erfolgreiche Zitat zurück
 */
  async function quoteMessage(content, quotedMessageId, threadId) {
    let request = new Request(domain + "/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `apiKey=${user.apiKey}&content=${content}&contentType=2&threadId=${threadId}&additional=${quotedMessageId}`,
    });
    let result = await fetch(request);
    console.log(result);

    if (!result.ok) {
      alert("Fehler beim Senden.");
    }
    return result.ok;
  }


  return (
    <Router>
      <Navbar links={currentThreadGroups} />
      <div className="mainDiv page-content">
        <Routes>
          <Route
            path="/"
            element={
              <ThreadGroups
                groups={currentThreadGroups}
                deleteThreadGroup={deleteThreadGroup}
              />
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/addThreadGroup"
            element={<AddThreadGroup addThreadGroup={addThreadGroup} />}
          />
          <Route
            path="/editThreadGroup/:groupId"
            element={<EditThreadGroup editThreadGroup={editThreadGroup} />}
          />
          <Route path="/rightsManagement" element={<RightsManagement />} />

          <Route
            path="/:groupName"
            element={<Threads deleteThread={deleteThread} />}
          />
          <Route path="/:groupName/:threadName" element={<Messages />} />
          <Route
            path="/:groupName/addThread"
            element={<AddThread addThread={addThread} />}
          />

          <Route
            path="/:groupName/:threadName/editMessage/:messageId"
            element={<EditMessage editMessage={editMessage} />}
          />

          <Route
            path="/:groupName/:threadName/quoteMessage/:messageId"
            element={<QuoteMessage quoteMessage={quoteMessage} />}
          />

          <Route
            path="/:groupName/editThread/:threadId"
            element={<EditThread editThread={editThread} />}
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </Router>
  );
}
