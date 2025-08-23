import { type RouteObject } from "react-router";
import DashboardPage from "../features/dashboard/dashboard";
import SettingsPage from "../features/settings/settings";
import UsersPage from "../features/users/users";
import BusPage from "../features/bus/bus";
import CustomerPage from "../features/customer/customer";
import ReportPage from "../features/report/report";
import DashboardIndex from "../features/dashboard";
import AnalysisPage from "../features/analysis/Analysis";
import RoleGuard from "../components/RoleGuard";
import TripPage from "../features/trip/trip";
import RoutePage from "../features/route/route_feature";
import EmployeePage from "../features/employee/employee";

export const AuthRoute: RouteObject = {
  path: "dashboard",
  element: <DashboardPage />,
  children: [
    {
      index: true,
      element: (
        <RoleGuard roles={["STAFF", "OPERATOR", "DRIVER"]}>
          <DashboardIndex />
        </RoleGuard>
      ),
    },
    {
      path: "analysis",
      element: (
        <RoleGuard roles={["STAFF", "OPERATOR"]}>
          <AnalysisPage />
        </RoleGuard>
      ),
    },
    {
      path: "settings",
      element: (
        <RoleGuard roles={["STAFF", "OPERATOR"]}>
          <SettingsPage />
        </RoleGuard>
      ),
    },
    {
      path: "users",
      element: (
        <RoleGuard roles={["STAFF", "OPERATOR"]}>
          <UsersPage />
        </RoleGuard>
      ),
    },
    {
      path: "buses",
      element: (
        <RoleGuard roles={["STAFF", "OPERATOR"]}>
          <BusPage />
        </RoleGuard>
      ),
    },
    {
      path: "trips",
      element: (
        <RoleGuard roles={["STAFF", "OPERATOR"]}>
          <TripPage />
        </RoleGuard>
      ),
    },
    {
      path: "routes",
      element: (
        <RoleGuard roles={["STAFF", "OPERATOR"]}>
          <RoutePage />
        </RoleGuard>
      ),
    },
    {
      path: "employees",
      element: (
        <RoleGuard roles={["STAFF", "OPERATOR"]}>
          <EmployeePage />
        </RoleGuard>
      ),
    },
    {
      path: "customer",
      element: (
        <RoleGuard roles={["STAFF", "OPERATOR", "DRIVER"]}>
          <CustomerPage />
        </RoleGuard>
      ),
    },
    {
      path: "report",
      element: (
        <RoleGuard roles={["STAFF", "OPERATOR"]}>
          <ReportPage />
        </RoleGuard>
      ),
    },
  ],
};
