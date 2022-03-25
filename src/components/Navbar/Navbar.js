import React, { Component, useState, useEffect } from "react";
import { MenuItems } from "./MenuItems";
import "./Navbar.css";
import { Button } from "../Button";
import { useAuth } from "../../contexts/Auth";

export default function Navbar({ links }) {
  const [clicked, setClicked] = useState(false);
  const { user, authenticated, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!authenticated) {
      setIsAdmin(false);
    } else {
      setIsAdmin("Admin" === user.role);
    }
  }, [authenticated]);

  function handleClick() {
    setClicked(!clicked);
  }

  function onSignOut() {
    signOut();
    window.location.href = "/";
  }

  return (
    <nav className="NavbarItems">
      <h1 className="navbar-logo">
        <a className="appCaption" href="/">
          Lehsetreff
        </a>
        <img className="appIcon" src="/Lehsetreff.png"></img>
      </h1>
      <div className="menu-icon" onClick={handleClick}>
        <i className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
      </div>
      <ul className={clicked ? "nav-menu active" : "nav-menu"}>
        {user ? (
          <li key={user}>
            <a className="nav-links" href="/profile">
              {user.userName}
            </a>
          </li>
        ) : null}
        {/* {links.map((item, index) => {
          return (
            <li key={index}>
              <a className="nav-links" href={`/threadGroups/${item.caption}`}>
                {item.caption}
              </a>
            </li>
          );
        })} */}

        {isAdmin ? (
          <li>
            <a href="/rightsManagement" className="nav-links">
              Rechteverwaltung
            </a>
          </li>
        ) : null}
        {MenuItems.map((item, index) => {
          if (item.title == "Sign up" && authenticated) {
            return null;
          }
          if (item.title == "Sign out" && !authenticated) {
            return null;
          }

          if (item.title == "Sign out") {
            return (
              <li key={index}>
                <a className={item.cName} onClick={onSignOut} href="#">
                  {item.title}
                </a>
              </li>
            );
          }

          return (
            <li key={index}>
              <a className={item.cName} href={item.url}>
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>

      {authenticated ? (
        <a href="#" onClick={onSignOut}>
          <Button>Sign Out</Button>
        </a>
      ) : (
        <a href="/login">
          <Button>Sign Up</Button>
        </a>
      )}
    </nav>
  );
}
