import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ReactQueryProvider } from "./providers/QueryProviders";
import { AuthProvider } from "./context/useAuth";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ReactQueryProvider>
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  </ReactQueryProvider>
);
