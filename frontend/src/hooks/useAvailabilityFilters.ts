import { useState } from "react";
import type { TablePreference } from "../types/api";

export interface AvailabilityFiltersValues {
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

  const filters: AvailabilityFiltersValues = {
    start,
    partySize,
    durationMinutes,
    zoneId,
    preferences,
  };

  return {
    filters,
    setStart,
    setPartySize,
    setDurationMinutes,
    setZoneId,
    setPreferences,
  };
}
