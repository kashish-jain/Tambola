import React from "react";
import ReactDOM from "react-dom";
import {doNotLeavePage} from './utils/utils'
import "./index.css";
import App from "./components/App";

window.addEventListener("beforeunload", doNotLeavePage);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

