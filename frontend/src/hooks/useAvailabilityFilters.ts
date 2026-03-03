import { useState } from "react";

export type TablePreference = "QUIET" | "WINDOW" | "NEAR_KIDS" | "ACCESSIBLE";

export interface AvailabilityFiltersState {
  start: string | null;
  partySize: number;
  durationMinutes: number;
  zoneId: string | null;
  preferences: TablePreference[];
}

export function useAvailabilityFilters() {
  const [start, setStart] = useState<string | null>(null);
  const [partySize, setPartySize] = useState<number>(2);
  const [durationMinutes, setDurationMinutes] = useState<number>(120);
  const [zoneId, setZoneId] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<TablePreference[]>([]);

  const filters: AvailabilityFiltersState = {
    start,
    partySize,
    durationMinutes,
    zoneId,
    preferences,
  };

  function handleFindTables() {
    console.log(filters);
  }

  return {
    filters,
    setStart,
    setPartySize,
    setDurationMinutes,
    setZoneId,
    setPreferences,
    handleFindTables,
  };
}
