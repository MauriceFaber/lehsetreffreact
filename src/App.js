import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import ThreadGroups from "./components/ThreadGroups/ThreadGroups";
import Threads from "./components/Threads/Threads";
import Messages from "./components/Messages/Messages";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import { useAuth } from "./contexts/auth";
import Profile from "./components/User/Profile";
import Login from "./components/User/Login";

import AddThreadGroup from "./components/ThreadGroups/AddThreadGroup";
import EditThreadGroup from "./components/ThreadGroups/EditThreadGroup";

// export const domain = "http://localhost:8080/lehsetreff";
export const domain = "https://octopi.mauricefaber.de";
// export const domain = "https://api.lehsetreff.de";
// export const domain = "http://raspberrypi:8080/lehsetreff";

export default function App() {
  const [currentThreadGroups, setThreadGroups] = useState([]);
  const { user, authenticated, signInAutomatically, signIn, singOut } =
    useAuth();

  useEffect(() => {
    if (!authenticated) {
      signInAutomatically();
    }
  }, [signInAutomatically, authenticated]);

  async function reloadThreadGroups() {
    const request = new Request(domain + "/threadGroups");
    let data = await fetch(request);
    data = await data.json();
    setThreadGroups(data);
  }

  useEffect(async () => {
    await reloadThreadGroups();
  }, []);

  function logoutClicked() {
    singOut();
  }

  async function deleteThreadGroup(group) {
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
      //   headers: {
      //     "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      //   },
      body: bodyArg,
    });

    let result = await fetch(request);
    return result.ok;
  }

  return (
    <Router>
      <Navbar links={currentThreadGroups} />
      {/* <input type="button" onClick={loginClicked} value="login"></input> */}
      {/* <input type="button" onClick={logoutClicked} value="logout"></input> */}
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
        <Route path="/threadGroups/:groupName" element={<Threads />} />
        <Route
          path="/addThreadGroup"
          element={<AddThreadGroup addThreadGroup={addThreadGroup} />}
        />
        <Route
          path="/editThreadGroup/:groupId"
          element={<EditThreadGroup editThreadGroup={editThreadGroup} />}
        />
        <Route path="/threads/:threadName" element={<Messages />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}
