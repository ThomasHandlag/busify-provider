import { type RouteObject } from "react-router";
import DashboardPage from "../features/dashboard/dashboard";
import SettingsPage from "../features/settings/settings";
import BusPage from "../features/bus/bus";
import ReportPage from "../features/report/report";
import DashboardIndex from "../features/dashboard";
import AnalysisPage from "../features/analysis/Analysis";
import RoleGuard from "../components/RoleGuard";
import DriverManagement from "../features/driver/driver";
import TripPage from "../features/trip/trip";
import RoutePage from "../features/route/route_feature";
import EmployeePage from "../features/employee/employee";
import ProfilePage from "../features/profile/Profile";
import TicketPage from "../features/tickets/Ticket";

export const AuthRoute: RouteObject = {
  path: "dashboard",
  element: <DashboardPage />,
  children: [
    {
      index: true,
      element: (
        <RoleGuard roles={["STAFF", "OPERATOR"]}>
          <DashboardIndex />
        </RoleGuard>
      ),
    },
    {
      path: "analysis",
      element: (
        <RoleGuard roles={["OPERATOR"]}>
          <AnalysisPage />
        </RoleGuard>
      ),
    },
    {
      path: "settings",
      element: (
        <RoleGuard roles={["OPERATOR"]}>
          <SettingsPage />
        </RoleGuard>
      ),
    },
    {
      path: "buses",
      element: (
        <RoleGuard roles={["OPERATOR"]}>
          <BusPage />
        </RoleGuard>
      ),
    },
    {
      path: "trips",
      element: (
        <RoleGuard roles={["OPERATOR"]}>
          <TripPage />
        </RoleGuard>
      ),
    },
    {
      path: "routes",
      element: (
        <RoleGuard roles={["OPERATOR"]}>
          <RoutePage />
        </RoleGuard>
      ),
    },
    {
      path: "employees",
      element: (
        <RoleGuard roles={["OPERATOR"]}>
          <EmployeePage />
        </RoleGuard>
      ),
    },
    {
      path: "report",
      element: (
        <RoleGuard roles={["OPERATOR"]}>
          <ReportPage />
        </RoleGuard>
      ),
    },
    {
      path: "tickets",
      element: (
        <RoleGuard roles={["STAFF", "OPERATOR"]}>
          <TicketPage />
        </RoleGuard>
      ),
    },
    {
      path: "driver",
      element: (
        <RoleGuard roles={["STAFF", "OPERATOR"]}>
          <DriverManagement />
        </RoleGuard>
      ),
    },
    {
      path: "profile",
      element: (
        <RoleGuard roles={["OPERATOR"]}>
          <ProfilePage />
        </RoleGuard>
      ),
    },
    // {
    //   path: "tickets",
    //   element: (
    //     <RoleGuard roles={["STAFF", "OPERATOR"]}>
    //       <TicketPage />
    //     </RoleGuard>
    //   ),
    // },
  ],
};
