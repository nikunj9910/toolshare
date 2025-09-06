import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

// pages
import Home from "./pages/Home";
import Browse from "./pages/Browse";
import ToolDetail from "./pages/ToolDetail";
import Checkout from "./pages/Checkout";

// extras
import DarkToggle from "./components/DarkToggle";
import ImpactCounter from "./components/ImpactCounter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ImpactProvider } from "./contexts/ImpactContext";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/browse", element: <Browse /> },
  { path: "/tool/:id", element: <ToolDetail /> },
  { path: "/checkout", element: <Checkout /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ImpactProvider>
      <ErrorBoundary>
        <RouterProvider router={router} />
        <DarkToggle />
        <ImpactCounter />
      </ErrorBoundary>
    </ImpactProvider>
  </React.StrictMode>
);
