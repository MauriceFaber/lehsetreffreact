import React, { useState } from "react";
import createCtx from "./Ctx";
import { domain } from "../App";

export const [useAuth, CtxProvider] = createCtx();

export default function AuthProvider(props) {
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const signIn = async (username, password) => {
    try {
      setLoading(true);

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
        console.log("logged in");
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

  const register = async (username, password, avatar) => {
    try {
      setLoading(true);

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
        console.log("registred in");
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

  const signOut = () => {
    try {
      console.log("signing out");
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
    signIn,
    signOut,
    signInAutomatically,
    register,
  };
  return <CtxProvider value={contextValue}>{props.children}</CtxProvider>;
}
