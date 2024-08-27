import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import "react-toastify/dist/ReactToastify.css";

import { RouterProvider } from "react-router-dom";
import { router } from "./App";
import { AuthProvider } from "@contexts/AuthContext";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ToastContainer autoClose={3000} />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
