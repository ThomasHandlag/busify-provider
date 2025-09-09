import { create } from "zustand";
import type { WeeklyReportData } from "../features/dashboard";
import { persist } from "zustand/middleware";

export const weeklyReportStore = create<{
  report: WeeklyReportData | null;
  setReport: (report: WeeklyReportData | null) => void;
}>()(
  persist(
    (set) => ({
      report: null,
      setReport: (report: WeeklyReportData | null) => set({ report }),
    }),
    {
      name: "weekly-report-storage",
    }
  )
);
