import React, { Component, useState } from "react";
import { MenuItems } from "./MenuItems";
import "./Navbar.css";
import { Button } from "../Button";

export default function Navbar({ links }) {
  const [clicked, setClicked] = useState(false);

  function handleClick() {
    setClicked(!clicked);
  }

  return (
    <nav className="NavbarItems">
      <h1 className="navbar-logo">
        <a href="/">
          Lehsetreff
          <i>
            <img
              className="appIcon"
              src="https://lehsetreff.de/favicon.ico"
            ></img>
          </i>
        </a>
      </h1>
      <div className="menu-icon" onClick={handleClick}>
        <i className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
      </div>
      <ul className={clicked ? "nav-menu active" : "nav-menu"}>
        {links.map((item, index) => {
          return (
            <li key={index}>
              <a className="nav-links" href={`/threads/${item.id}`}>
                {item.caption}
              </a>
            </li>
          );
        })}
        {MenuItems.map((item, index) => {
          return (
            <li key={index}>
              <a className={item.cName} href={item.url}>
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
      <Button>Sign Up</Button>
    </nav>
  );
}
