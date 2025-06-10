import React from "react";
import ReactDOM from "react-dom/client";
import BotBuilder from "./App";
import "./index.css";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BotBuilder />
  </React.StrictMode>
);