import React from "react";
import "./App.css";
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./lib/pages/MainPage.jsx";
import Login from "./lib/pages/Login.jsx";
import Register from "./lib/pages/Register.jsx";

setBasePath(
  "https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.13.1/cdn/"
);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.router = createBrowserRouter([
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/",
        element: <MainPage />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ]);
  }

  render() {
    return <RouterProvider router={this.router} />;
  }
}

export default App;
