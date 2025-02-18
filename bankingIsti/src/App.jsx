import React from "react";
import "./App.css";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import MainPage from "./lib/pages/MainPage.jsx";
import Login from "./lib/pages/Login.jsx";
import Register from "./lib/pages/Register.jsx";
import BankPage from "./lib/pages/BankPage.jsx";

setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.13.1/cdn/"
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <MainPage />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/bank/:id",
    element: <BankPage />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
