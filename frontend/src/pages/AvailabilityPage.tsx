import { Stack } from "@mantine/core";
import { AvailabilityFilters } from "../components/AvailabilityFilters.tsx";
import { useAvailabilitySearch } from "../hooks/useAvailabilitySearch.ts";
import { AvailabilityResult } from "../components/AvailabilityResult.tsx";

export function AvailabilityPage() {
  const { submitFilters, hasSubmitted, availabilityQuery } =
    useAvailabilitySearch();

  return (
    <Stack gap="md">
      <AvailabilityFilters onSubmit={submitFilters} />
      <AvailabilityResult
        hasSubmitted={hasSubmitted}
        availabilityQuery={availabilityQuery}
      />
    </Stack>
  );
}
