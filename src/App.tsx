import { createBrowserRouter } from "react-router-dom";

import { Home } from "./screens/home";
import { Login } from "./screens/login";
import { Register } from "./screens/register";
import { Dashboard } from "./screens/dashboard";
import { New } from "./screens/dashboard/new";
import { CarDetails } from "./screens/car";

import { Layout } from "./components/layout";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "car/id",
        element: <CarDetails />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/dashboard/new",
        element: <New />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export { router };
