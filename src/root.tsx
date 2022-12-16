import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import App from "./app";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";

export default function Root() {
  return (
    <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Route>
              <App />
            </Route>
          </BrowserRouter>
        </AuthProvider>
    </ToastProvider>
  );
}
