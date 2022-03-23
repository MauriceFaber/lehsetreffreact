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

export const domain = "https://octopi.mauricefaber.de";
// export const domain = "https://api.lehsetreff.de";
// export const domain = "http://raspberrypi:8080/lehsetreff";

export default function App() {
  const [currentThreadGroups, setThreadGroups] = useState([]);
  const { username, authenticated, signInAutomatically, signIn, singOut } =
    useAuth();

  useEffect(() => {
    if (!authenticated) {
      signInAutomatically();
    }
  }, [signInAutomatically, authenticated]);

  useEffect(async () => {
    const request = new Request(domain + "/threadGroups");
    let data = await fetch(request);
    data = await data.json();
    setThreadGroups(data);
  }, []);

  function logoutClicked() {
    singOut();
  }

  return (
    <Router>
      <Navbar links={currentThreadGroups} />
      {/* <input type="button" onClick={loginClicked} value="login"></input> */}
      {/* <input type="button" onClick={logoutClicked} value="logout"></input> */}
      <Routes>
        <Route
          path="/"
          element={<ThreadGroups groups={currentThreadGroups} />}
        />
        <Route path="/threadGroups/:groupName" element={<Threads />} />
        <Route path="/threads/:threadName" element={<Messages />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}
