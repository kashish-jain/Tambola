import React from "react";
import { createRoot } from 'react-dom/client';

import { doNotLeavePage } from './utils/utils'
import "./index.css";
import App from "./components/App";

window.addEventListener("beforeunload", doNotLeavePage);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
<React.StrictMode>
  <App />
</React.StrictMode>);
