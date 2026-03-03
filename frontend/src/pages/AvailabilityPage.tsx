import { Stack } from "@mantine/core";
import { AvailabilityFilters } from "../components/AvailabilityFilters.tsx";
import type { AvailabilityFiltersValues } from "../types/availability.ts";

export function AvailabilityPage() {
  const handleSubmit = (filters: AvailabilityFiltersValues) => {
    console.log("Submitted filters:", filters);
  };

  return (
    <Stack gap="md">
      <AvailabilityFilters onSubmit={handleSubmit} />
    </Stack>
  );
}
