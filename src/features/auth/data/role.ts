const Role = {
  DRIVER: "DRIVER",
  OPERATOR: "OPERATOR",
  STAFF: "STAFF",
} as const;

export type Role = typeof Role[keyof typeof Role];
