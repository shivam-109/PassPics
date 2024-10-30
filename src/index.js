// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Keep this if you have other styles
import "./Styles.css"; // Add this line for your new styles
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
