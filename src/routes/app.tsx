import { createBrowserRouter } from "react-router";
import App from "../App";
import LoginPage from "../features/auth/login";
import { AuthRoute } from "./auth";
import NotFoundPage from "../features/common/NotFound";
import Unauthenticated from "../features/common/Unauthenticated";
import Forbidden from "../features/common/Forbidden";
import InternalServerError from "../features/common/InternalServerError";
import { Navigate } from "react-router";
import Unauthorized from "../features/common/Unauthorized";

export const AppRoute = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      AuthRoute,
      {
        path: "*",
        element: <NotFoundPage />,
      },
      {
        path: "unauthorized",
        element: <Unauthorized />,
      },
      {
        path: "unauthenticated",
        element: <Unauthenticated />,
      },
      {
        path: "forbidden",
        element: <Forbidden />,
      },
      {
        path: "internal-server-error",
        element: <InternalServerError />,
      },
    ],
  },
]);
