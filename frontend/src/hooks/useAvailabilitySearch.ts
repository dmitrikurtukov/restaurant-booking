import type { AvailabilityFiltersValues } from "../types/availability.ts";
import { type AvailabilityQuery, getAvailability, toAvailabilitySearchParams } from "../api/restaurantApi.ts";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import type { AvailabilityResponse } from "../types/api.ts";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../api/queryKeys.ts";

function mapFiltersToAvailabilityQuery(
  filters: AvailabilityFiltersValues,
): AvailabilityQuery | null {
  if (!filters.start) return null;

  const parsedStart = dayjs(filters.start);
  if (!parsedStart) return null;

  return {
    start: parsedStart.format("YYYY-MM-DDTHH:mm:ss"),
    partySize: filters.partySize,
    durationMinutes: filters.durationMinutes,
    zoneId: filters.zoneId ? Number(filters.zoneId) : undefined,
    preferences: filters.preferences,
  };
}

export function useAvailabilitySearch() {
  const [submittedFilters, setSubmittedFilters] =
    useState<AvailabilityFiltersValues | null>(null);

  const availabilityQueryInput = useMemo(
    () =>
      submittedFilters ? mapFiltersToAvailabilityQuery(submittedFilters) : null,
    [submittedFilters],
  );

  const availabilityQueryKey = useMemo(
    () =>
      availabilityQueryInput
        ? toAvailabilitySearchParams(availabilityQueryInput).toString()
        : "idle",
    [availabilityQueryInput],
  );

  const availabilityQuery = useQuery<AvailabilityResponse, Error>({
    queryKey: queryKeys.availability(availabilityQueryKey),
    queryFn: () => getAvailability(availabilityQueryInput as AvailabilityQuery),
    enabled: availabilityQueryInput !== null,
  });

  function submitFilters(filters: AvailabilityFiltersValues) {
    setSubmittedFilters(filters);
  }

  return {
    submitFilters,
    hasSubmitted: submittedFilters !== null,
    availabilityQuery,
  };
}
