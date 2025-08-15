import { create } from "zustand";
import type { WeeklyReportData } from "../features/dashboard";

export const weeklyReportStore = create<{
  report: WeeklyReportData | null;
  setReport: (report: WeeklyReportData | null) => void;
}>((set) => ({
  report: null,
  setReport: (report: WeeklyReportData | null) => set({ report }),
}));
