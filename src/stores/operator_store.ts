import { create } from "zustand";

export interface OperatorData {
  id: number;
  name: string;
  hotline: string;
  address: string;
  email: string;
  description: string;
  status: "active" | "inactive" | "maintenance";
  avatarUrl?: string;
}

export type OperatorUpdatePayload = Partial<OperatorData> & {
  avatar?: File;
};

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const operatorStore = create<{
  operator: OperatorData | null;
  setOperator: (operator: OperatorData | null) => void;
}>((set) => ({
  operator: null,
  setOperator: (operator) => set({ operator }),
}));
