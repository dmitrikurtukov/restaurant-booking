import { Alert, Center, Loader, Stack } from "@mantine/core";
import { AvailabilityFilters } from "../components/AvailabilityFilters.tsx";
import { useAvailabilitySearch } from "../hooks/useAvailabilitySearch.ts";
import { AvailabilityResult } from "../components/AvailabilityResult.tsx";
import { useLayoutZoneOptions } from "../hooks/useLayoutZoneOptions.ts";

export function AvailabilityPage() {
  const { submitFilters, hasSubmitted, availabilityQuery } =
    useAvailabilitySearch();

  const { zoneOptions, zoneNameById, isError, isLoading } =
    useLayoutZoneOptions();

  if (isLoading)
    return (
      <Center h="calc(100vh - 200px)">
        <Loader />
      </Center>
    );

  if (isError) {
    return (
      <Alert color="red" title="Failed to load zones">
        Could not load layout zones. Please try again.
      </Alert>
    );
  }

  return (
    <Stack gap="md">
      <AvailabilityFilters onSubmit={submitFilters} zoneOptions={zoneOptions} />
      <AvailabilityResult
        hasSubmitted={hasSubmitted}
        availabilityQuery={availabilityQuery}
        zoneNameById={zoneNameById}
      />
    </Stack>
  );
}
