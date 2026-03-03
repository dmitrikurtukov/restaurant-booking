import { Stack } from "@mantine/core";
import { AvailabilityFilters } from "../components/AvailabilityFilters.tsx";

export function AvailabilityPage() {
  return (
    <Stack gap="md">
      <AvailabilityFilters />
    </Stack>
  );
}
