import React, { useState, useEffect } from "react";
import createCtx from "./Ctx";
import { domain } from "../App";

export const [useAuth, CtxProvider] = createCtx();
/**
 * Liefert den Dialog zur Authentifizierung zurück.
 * @param {*} props
 * Überprüfung der Nutzerrolle.
 * @returns
 * Liefert die Rolle des Nutzers zurück.
 */
export default function AuthProvider(props) {
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const [isUser, setIsUser] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!authenticated) {
      setIsUser(false);
      setIsModerator(false);
      setIsAdmin(false);
    } else {
      setIsUser(["User", "Mod", "Admin"].includes(user.role));
      setIsModerator(["Mod", "Admin"].includes(user.role));
      setIsAdmin(["Admin"].includes(user.role));
    }
  }, [authenticated]);

  const setAvatar = (avatar) => {
    let newUser = JSON.parse(JSON.stringify(user));
    newUser.avatar = avatar;
    setUser(newUser);
  };

  /**
   * Einloggen des Benutzers.
   * @param {*} username
   * Überprüfung des Benutzernamens.
   * @param {*} password
   * Überprüfung des Passworts.
   * @returns
   * True, falls erfolgreich eingeloggt, ansonsten false.
   */
  const signIn = async (username, password) => {
    try {
      setLoading(true);

      if (!username || !password) {
        return false;
      }

      let request = new Request(domain + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: `userName=${username}&passphrase=${password}`,
      });

      let response = await fetch(request);
      if (response.ok) {
        let result = await response.json();
        localStorage.setItem("apiKey", result.apiKey);
        setUser(result);
        setAuthenticated(true);
      }
      return response.ok;
    } catch (err) {
      return false;
    } finally {
      setLoading(false);
    }
  };
  /**
   * Registrieren des Benutzers.
   * @param {*} username
   * Anlegen eines Benutzernamens.
   * @param {*} password
   * Vergabe eines Passworts.
   * @returns
   * True, falls Registrierung erfolgreich war, ansonsten false.
   */
  const register = async (username, password) => {
    try {
      setLoading(true);

      if (!username || !password) {
        return false;
      }

      let request = new Request(domain + "/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: `userName=${username}&passphrase=${password}`,
      });

      let result = await fetch(request);
      if (result.ok) {
        result = await result.json();
        localStorage.setItem("apiKey", result.apiKey);
        setUser(result);
        setAuthenticated(true);
      }

      return result.ok;
    } catch (err) {
      return false;
    } finally {
      setLoading(false);
    }
  };
  /**
   * Automatisches Login ohne manuelle Authentifizierung.
   * @returns
   * True, bei erfolg, ansonsten false.
   */
  const signInAutomatically = async () => {
    try {
      setLoading(true);

      const apiKey = localStorage.getItem("apiKey");
      if (apiKey && apiKey !== "") {
        let request = new Request(domain + `/users?apiKey=${apiKey}`);
        let result = undefined;
        await fetch(request).then(async (returnedResponse) => {
          result = await returnedResponse.json();
          result.apiKey = apiKey;
          setUser(result);
          setAuthenticated(true);
          return true;
        });
      } else {
        signOut();
        return false;
      }
      return false;
    } catch (err) {
      return false;
    } finally {
      setLoading(false);
    }
  };
  /**
   * Funktion zum Ausloggen
   */
  const signOut = () => {
    try {
      setLoading(true);
      localStorage.removeItem("apiKey");
      setUser(null);
      setAuthenticated(false);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    loading,
    authenticated,
    user,
    isUser,
    isModerator,
    isAdmin,
    signIn,
    signOut,
    signInAutomatically,
    register,
    setAvatar,
  };
  return <CtxProvider value={contextValue}>{props.children}</CtxProvider>;
}
