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
 * Hauptdarstellung der Anwendung.
 * @returns
 * Liefert die einzelnen Pfade der benötigten Funktionen aus der App.
 */
export default function App() {
  const [currentThreadGroups, setThreadGroups] = useState();
  const { user, authenticated, signInAutomatically, signIn, singOut } =
    useAuth();

  useEffect(() => {
    if (!authenticated) {
      signInAutomatically();
    }
  }, [signInAutomatically, authenticated]);

  /**
   * Funktion zum Aktualisieren der Threadgruppe.
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
   * Löschen von Threadgruppe mit vorheriger Abfrage.
   * @param {*} group
   * Gewählte Gruppe.
   * @returns
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
   * Löschen von Thread.
   * @param {*} thread
   * Gewählter Themas.
   * @returns
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
   * Hinzufügen einer Threadgruppe.
   * @param {*} caption
   * Überschrift.
   * @param {*} description
   * Beschreibung.
   * @returns
   * True, falls erfolgreich, false ansonsten.
   */
  async function addThreadGroup(caption, description) {
    let request = new Request(domain + "/threadGroups", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `apiKey=${user.apiKey}&caption=${encodeURIComponent(
        caption
      )}&description=${encodeURIComponent(description)}`,
    });

    let result = await fetch(request);
    return result.ok;
  }
  /**
   * Bearbeiten einer Threadgruppe.
   * @param {*} id
   * ID der Threadgruppe.
   * @param {*} caption
   * Überschrift.
   * @param {*} description
   * Beschreibung.
   * @returns
   * True, falls erfolgreich, false ansonsten.
   */
  async function editThreadGroup(id, caption, description) {
    let bodyArg = `apiKey=${user.apiKey}&id=${id}`;
    if (caption) {
      bodyArg += `&caption=${encodeURIComponent(caption)}`;
    }
    if (description) {
      bodyArg += `&description=${encodeURIComponent(description)}`;
    }
    let request = new Request(domain + "/threadGroups", {
      method: "PUT",
      body: bodyArg,
    });

    let result = await fetch(request);
    return result.ok;
  }
  /**
   * Hinzufügen eines Threads
   * @param {*} groupName
   * Name der Threadgruppe.
   * @param {*} caption
   * Überschrift des Threads.
   * @param {*} description
   * Beschreibung des Threads.
   * @returns
   * True, falls erfolgreich, false ansonsten.
   */
  async function addThread(groupName, caption, description) {
    let request = new Request(domain + "/threads", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `apiKey=${user.apiKey}&groupName=${encodeURIComponent(
        groupName
      )}&caption=${encodeURIComponent(
        caption
      )}&description=${encodeURIComponent(description)}`,
    });

    let result = await fetch(request);
    return result.ok;
  }
  /**
   * Bearbeiten eines Threads
   * @param {*} id
   * Id des Threads.
   * @param {*} caption
   * Überschrift des Threads.
   * @param {*} description
   * Beschreibung des Threads.
   * @returns
   * True, falls erfolgreich, ansonsten false.
   */
  async function editThread(id, caption, description) {
    let bodyArg = `apiKey=${user.apiKey}&threadId=${id}`;
    if (caption) {
      bodyArg += `&caption=${encodeURIComponent(caption)}`;
    }
    if (description) {
      bodyArg += `&description=${encodeURIComponent(description)}`;
    }
    let request = new Request(domain + "/threads", {
      method: "PUT",
      body: bodyArg,
    });

    let result = await fetch(request);
    return result.ok;
  }
  /**
   * Bearbeiten einer Nachricht.
   * @param {*} messageId
   * NachrichtenID.
   * @param {*} content
   * Inhalt der Nachricht.
   * @param {*} type
   * Datentyp der Nachricht.
   * @returns
   * True, falls erfolgreich, ansonsten false.
   */
  async function editMessage(messageId, content, type) {
    if (type != 0) {
      return false;
    }
    let request = new Request(domain + "/messages", {
      method: "PUT",
      body: `apiKey=${
        user.apiKey
      }&messageID=${messageId}&content=${encodeURIComponent(
        content
      )}&contentType=${type}`,
    });
    let result = await fetch(request);

    return result.ok;
  }
  /**
   * Zitieren einer Nachricht.
   * @param {*} content
   * Inhalt der Nachricht
   * @param {*} quotedMessageId
   * Id der zitierten Nachricht.
   * @param {*} threadId
   * ThreadId.
   * @returns
   * True, falls erfolgreich, ansonsten false.
   */
  async function quoteMessage(content, quotedMessageId, threadId) {
    let request = new Request(domain + "/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `apiKey=${user.apiKey}&content=${encodeURIComponent(
        content
      )}&contentType=2&threadId=${threadId}&additional=${quotedMessageId}`,
    });
    let result = await fetch(request);

    if (!result.ok) {
      alert("Fehler beim Senden.");
    }
    return result.ok;
  }

  return (
    <Router>
      <Navbar />
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
