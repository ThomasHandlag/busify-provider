import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// patch for React 19 compatibility
// if you are using React 18, you can remove this line
import "@ant-design/v5-patch-for-react-19";
import { RouterProvider } from "react-router";
import { AppRoute } from "./routes/app.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={AppRoute} />
    </QueryClientProvider>
  </StrictMode>
);
// TODO: Sign in, roles, Registration, Report and Analysis
