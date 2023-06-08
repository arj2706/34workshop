import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { createRoot } from "react-dom";
import ReactDOM from 'react-dom';
import App from "./App";

createRoot(document.getElementById("root")).render(
  <Router>
    <App />
  </Router>
);
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);








