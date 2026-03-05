import { Alert, Center, Grid, Loader, Stack } from "@mantine/core";
import { AvailabilityFilters } from "../components/AvailabilityFilters.tsx";
import { useAvailabilitySearch } from "../hooks/useAvailabilitySearch.ts";
import { useLayoutZoneOptions } from "../hooks/useLayoutZoneOptions.ts";
import { TableMap } from "../components/TableMap.tsx";
import { TableDetails } from "../components/TableDetails.tsx";
import { useAvailabilityMapView } from "../hooks/useAvailabilityMapView.ts";
import { useTableReservation } from "../hooks/useTableReservation.ts";
import { ReservationSuccessModal } from "../components/ReservationSuccessModal.tsx";

export function AvailabilityPage() {
  const { submitFilters, hasSubmitted, availabilityQuery, activeQuery } =
    useAvailabilitySearch();

  const { zoneOptions, zoneNameById, isError, isLoading } =
    useLayoutZoneOptions();

  const {
    tableMapModel,
    selectedTableId,
    setSelectedTableId,
    selectedTable,
    recommendedTableId,
    topRecommendations,
  } = useAvailabilityMapView({
    data: availabilityQuery.data,
    zoneNameById,
  });

  const {
    canReserve,
    isReserving,
    reserveTable,
    reservationError,
    reservationSuccess,
    closeReservationSuccess,
  } = useTableReservation({
    selectedTable,
    activeQuery,
    refetchAvailability: availabilityQuery.refetch,
  });

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

  if (hasSubmitted && availabilityQuery.isLoading) {
    return (
      <Stack gap="md">
        <AvailabilityFilters
          onSubmit={submitFilters}
          zoneOptions={zoneOptions}
        />
        <Center h={220}>
          <Loader />
        </Center>
      </Stack>
    );
  }

  if (hasSubmitted && availabilityQuery.isError) {
    return (
      <Stack gap="md">
        <AvailabilityFilters
          onSubmit={submitFilters}
          zoneOptions={zoneOptions}
        />
        <Alert color="red" title="Failed to load availability">
          {availabilityQuery.error.message}
        </Alert>
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <AvailabilityFilters onSubmit={submitFilters} zoneOptions={zoneOptions} />

      {hasSubmitted && availabilityQuery.data && (
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <TableMap
              model={tableMapModel}
              selectedTableId={selectedTableId}
              onSelectTable={setSelectedTableId}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <TableDetails
              table={selectedTable}
              zoneNameById={zoneNameById}
              isRecommended={selectedTable?.id === recommendedTableId}
              isTopRecommendation={
                selectedTable
                  ? topRecommendations.includes(selectedTable.id)
                  : false
              }
              canReserve={canReserve}
              isReserving={isReserving}
              onReserve={reserveTable}
              reservationError={reservationError}
            />
          </Grid.Col>
        </Grid>
      )}

      <ReservationSuccessModal
        opened={Boolean(reservationSuccess)}
        successData={reservationSuccess}
        zoneNameById={zoneNameById}
        onClose={closeReservationSuccess}
      />
    </Stack>
  );
}
