export const queryKeys = {
  layout: ["layout"] as const,
  availability: (params: string) => ["availability", params] as const,
};
