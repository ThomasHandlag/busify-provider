import { createBrowserRouter } from "react-router";
import App from "../App";
import LoginPage from "../features/auth/login";
import { AuthRoute } from "./auth";
import NotFoundPage from "../features/common/not_found";

export const AppRoute = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      AuthRoute,
      {
        path: "*",
        element: <NotFoundPage />,
      }
    ],
  },
]);
