import React, { Component, useState, useEffect } from "react";
import { MenuItems } from "./MenuItems";
import "./Navbar.css";
import { Button } from "../Button";
import { useAuth } from "../../contexts/Authentication";

/**
 * Erstellt die Benutzeransicht/Menüleiste entsprechend der Berechtigungen.
 * @returns
 * Ansicht nach Berechtigung.
 * Falls Admin wird zusatzlich Rechteverwaltung erstellt.
 */
export default function Navbar() {
  const [clicked, setClicked] = useState(false);
  const { user, authenticated, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  /**
   * Setzt Admin Status entsprechend der Benutzer Rolle.
   */
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

  /**
   * Loggt den Nutzer aus und springt zur Startseite zurück
   */
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

        {isAdmin ? (
          <li>
            <a href="/rightsManagement" className="nav-links">
              Rechteverwaltung
            </a>
          </li>
        ) : null}
        {MenuItems.map((item, index) => {
          if (item.title == "Anmelden" && authenticated) {
            return null;
          }
          if (item.title == "Abmelden" && !authenticated) {
            return null;
          }

          if (item.title == "Abmelden") {
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
          <Button>Abmelden</Button>
        </a>
      ) : (
        <a href="/login">
          <Button>Anmelden</Button>
        </a>
      )}
    </nav>
  );
}
