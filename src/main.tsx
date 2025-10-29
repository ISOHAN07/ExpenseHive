import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ReactQueryProvider } from "./providers/QueryProviders";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ReactQueryProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ReactQueryProvider>
);
