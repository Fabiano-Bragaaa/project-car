import { createBrowserRouter } from "react-router-dom";

import { Home } from "@screens/home";
import { Login } from "@screens/login";
import { Register } from "@screens/register";
import { Dashboard } from "@screens/dashboard";
import { New } from "@screens/dashboard/new";
import { CarDetails } from "@screens/car";

import { Layout } from "@components/layout";
import { Private } from "@routes/Private";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "car/:id",
        element: <CarDetails />,
      },
      {
        path: "/dashboard",
        element: (
          <Private>
            <Dashboard />
          </Private>
        ),
      },
      {
        path: "/dashboard/new",
        element: (
          <Private>
            <New />
          </Private>
        ),
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
