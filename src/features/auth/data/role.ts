const Role = {
  OPERATOR: "OPERATOR",
  DRIVER: "DRIVER",
  STAFF: "STAFF",
} as const;

export type Role = typeof Role[keyof typeof Role];
