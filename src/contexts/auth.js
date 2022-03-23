import React, { FC, useState } from "react";
import createCtx from "./index";
import { domain } from "../App";

export const [useAuth, CtxProvider] = createCtx();

export default function AuthProvider(props) {
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const signIn = async (username, password) => {
    try {
      setLoading(true);

      setTimeout(async () => {
        let request = new Request(domain + "/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: `userName=${username}&passphrase=${password}`,
        });

        let result = undefined;

        await fetch(request)
          .then(async (returnedResponse) => {
            result = await returnedResponse.json();
            localStorage.setItem("apiKey", result.apiKey);
            console.log("logged in");
          })
          .catch((error) => {
            console.log("error logging in");
          });
        console.log(result);

        setUser(result);
        setAuthenticated(true);
      }, 2000);

      return true;
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
        await fetch(request)
          .then(async (returnedResponse) => {
            result = await returnedResponse.json();
            result.apiKey = apiKey;
            setUser(result);
            setAuthenticated(true);
            return true;
          })
          .catch((error) => {
            signOut();
            return false;
          });
      } else {
        signOut();
        return false;
      }
    } catch (err) {
      return false;
    } finally {
      setLoading(false);
    }
  };

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
    signIn,
    signOut,
    signInAutomatically,
  };
  return <CtxProvider value={contextValue}>{props.children}</CtxProvider>;
}
