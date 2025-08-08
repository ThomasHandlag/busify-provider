import { type RouteObject } from "react-router";
import DashboardPage from "../features/dashboard/dashboard";
import AnalyticsPage from "../features/analystic/analystic";
import SettingsPage from "../features/settings/settings";
import UsersPage from "../features/users/users";
import BusPage from "../features/bus/bus";
import CustomerPage from "../features/customer/customer";
import ReportPage from "../features/report/report";
import DashboardIndex from "../features/dashboard";

export const AuthRoute: RouteObject = {
  path: "dashboard",
  element: <DashboardPage />,
  children: [
    {
      index: true,
      element: <DashboardIndex />,
    },
    {
      path: "analystics",
      element: <AnalyticsPage />,
    },
    {
      path: "settings",
      element: <SettingsPage />,
    },
    {
      path: "users",
      element: <UsersPage />,
    },
    {
        path: "buses",
        element: <BusPage />,
    },
    {
        path: "customer",
        element: <CustomerPage />,
    },
    {
        path: "report",
        element: <ReportPage />,
    }
  ],
};
