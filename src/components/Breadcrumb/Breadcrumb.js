import React from "react";
import "./Breadcrumb.css";
import { Link } from "react-router-dom";

export default function Breadcrumb({ groupName, threadName }) {
  return (
    <div className="breadcrumb-container">
      <Link className="noLink" to="/">
        <i>Home</i>
      </Link>

      {groupName ? <i>&nbsp;-&nbsp;</i> : null}

      {groupName ? (
        <Link className="noLink" to={`/${groupName}`}>
          <i>{groupName}</i>
        </Link>
      ) : null}

      {threadName ? <i>&nbsp;-&nbsp;</i> : null}

      {threadName ? (
        <Link className="noLink" to={`/${groupName}/${threadName}`}>
          <i>{threadName}</i>
        </Link>
      ) : null}
    </div>
  );
}
