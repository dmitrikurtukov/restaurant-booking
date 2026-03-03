import { useState } from "react";
import type { TablePreference } from "../types/api";
import type { AvailabilityFiltersValues } from "../types/availability";

export function useAvailabilityFilters() {
  const [start, setStart] = useState<string | null>(null);
  const [partySize, setPartySize] = useState<number>(2);
  const [durationMinutes, setDurationMinutes] = useState<number>(120);
  const [zoneId, setZoneId] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<TablePreference[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filters: AvailabilityFiltersValues = {
    start,
    partySize,
    durationMinutes,
    zoneId,
    preferences,
  };

  function validate(): boolean {
    if (!filters.start) {
      setErrorMessage("Please select date and time.");
      return false;
    }
    setErrorMessage(null);
    return true;
  }

  return {
    filters,
    setStart,
    setPartySize,
    setDurationMinutes,
    setZoneId,
    setPreferences,
    errorMessage,
    validate,
  };
}
