import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import ThreadGroups from "./components/ThreadGroups/ThreadGroups";
import Threads from "./components/Threads/Threads";
import Messages from "./components/Messages/Messages";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";

export const domain = "https://octopi.mauricefaber.de";
// export const domain = "https://api.lehsetreff.de";
// export const domain = "http://raspberrypi:8080/lehsetreff";

export default function App() {
  const [currentThreadGroups, setThreadGroups] = useState([]);

  useEffect(async () => {
    const request = new Request(domain + "/threadGroups");
    let data = await fetch(request);
    data = await data.json();
    setThreadGroups(data);
  }, []);

  return (
    <Router>
      <Navbar links={currentThreadGroups} />
      <Routes>
        <Route
          path="/"
          element={<ThreadGroups groups={currentThreadGroups} />}
        />
        <Route path="/threadGroups/:groupName" element={<Threads />} />
        <Route path="/threads/:threadName" element={<Messages />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}
