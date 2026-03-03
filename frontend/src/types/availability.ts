import type { TablePreference } from "./api";

export interface AvailabilityFiltersValues {
  start: string | null;
  partySize: number;
  durationMinutes: number;
  zoneId: string | null;
  preferences: TablePreference[];
}
