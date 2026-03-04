import { Alert, Badge, Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import type { AvailabilityTableDto, TableStatus } from "../types/api";

type TableDetailsProps = {
  table: AvailabilityTableDto | null;
  zoneNameById: Record<string, string>;
  isRecommended: boolean;
  isTopRecommendation: boolean;
  canReserve: boolean;
  isReserving: boolean;
  onReserve: () => void;
  reservationError: string | null;
};

function statusLabel(status: TableStatus): string {
  if (status === "FREE") return "Available";
  if (status === "OCCUPIED") return "Occupied";
  return "Too small for selected party";
}

function statusColor(status: TableStatus): string {
  if (status === "FREE") return "green";
  if (status === "OCCUPIED") return "red";
  return "gray";
}

export function TableDetails({
  table,
  zoneNameById,
  isRecommended,
  isTopRecommendation,
  canReserve,
  isReserving,
  onReserve,
  reservationError,
}: Readonly<TableDetailsProps>) {
  return (
    <Card withBorder radius="md" p="md" h="100%">
      <Stack gap="sm">
        <Title order={5}>Table details</Title>

        {table ? (
          <>
            <Text>
              Zone:{" "}
              <Text span fw={600}>
                {zoneNameById[String(table.zoneId)] ?? `Zone ${table.zoneId}`}
              </Text>
            </Text>

            <Text>
              Seats:{" "}
              <Text span fw={600}>
                {table.capacity}
              </Text>
            </Text>

            <Group gap="xs">
              <Text>Status:</Text>
              <Badge color={statusColor(table.status)} variant="light">
                {statusLabel(table.status)}
              </Badge>
            </Group>

            <Group gap="xs">
              {isRecommended && (
                <Badge color="blue" variant="light">
                  Recommended
                </Badge>
              )}
              {isTopRecommendation && (
                <Badge color="indigo" variant="light">
                  Top recommendation
                </Badge>
              )}
            </Group>

            <Text size="sm" c="dimmed">
              Tip: choose an available table to proceed with reservation.
            </Text>

            {reservationError && (
              <Alert color="red" title="Reservation failed">
                {reservationError}
              </Alert>
            )}

            <Button
              onClick={onReserve}
              loading={isReserving}
              disabled={!canReserve}
            >
              Reserve table
            </Button>
          </>
        ) : (
          <Text c="dimmed">Select a table on the map to see details.</Text>
        )}
      </Stack>
    </Card>
  );
}
