import {Alert, Badge, Card, Group, Loader, Stack, Table, Text, Title,} from "@mantine/core";
import type {UseQueryResult} from "@tanstack/react-query";
import type {AvailabilityResponse, TableStatus} from "../types/api";
import {TableMap} from "./TableMap.tsx";
import {useMemo} from "react";
import {createTableMapModel} from "../lib/tableMapModel.ts";

type AvailabilityResultProps = {
  hasSubmitted: boolean;
  availabilityQuery: UseQueryResult<AvailabilityResponse, Error>;
  zoneNameById: Record<string, string>;
};

function getStatusBadgeColor(status: TableStatus): string {
  switch (status) {
    case "FREE":
      return "green";
    case "OCCUPIED":
      return "red";
    case "TOO_SMALL":
      return "gray";
    default:
      return "gray";
  }
}

export function AvailabilityResult({
  hasSubmitted,
  availabilityQuery,
  zoneNameById,
}: Readonly<AvailabilityResultProps>) {
  const availabilityData = availabilityQuery.data;
  const tables = availabilityData?.tables ?? [];
  const recommendedTableId = availabilityData?.recommendedTableId ?? null;
  const topRecommendations = availabilityData?.topRecommendations ?? [];

  const tableMapModel = useMemo(
    () =>
      createTableMapModel({
        tables,
        recommendedTableId,
        topRecommendations,
        zoneNameById,
      }),
    [tables, recommendedTableId, topRecommendations, zoneNameById],
  );

  if (!hasSubmitted) return null;

  if (availabilityQuery.isLoading) {
    return (
      <Card withBorder radius="md" p="md">
        <Group justify="center">
          <Loader size="sm" />
          <Text c="dimmed">Loading availability...</Text>
        </Group>
      </Card>
    );
  }

  if (availabilityQuery.isError) {
    return (
      <Alert color="red" title="Failed to load availability">
        {availabilityQuery.error.message}
      </Alert>
    );
  }

  if (!availabilityQuery.data) return null;

  return (
    <Card withBorder radius="md" p="md">
      <Stack gap="md">
        <Title order={5}>Availability Result</Title>

        <Group gap="xs">
          <Text fw={500}>Recommended table:</Text>
          <Badge color="blue" variant="light">
            {recommendedTableId ?? "None"}
          </Badge>
        </Group>

        <Group gap="xs">
          <Text fw={500}>Top 3:</Text>
          {topRecommendations.length > 0 ? (
            topRecommendations.map((tableId) => (
              <Badge key={tableId} variant="light" color="indigo">
                {tableId}
              </Badge>
            ))
          ) : (
            <Text c="dimmed">No recommendations</Text>
          )}
        </Group>

        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Capacity</Table.Th>
              <Table.Th>Zone</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Score</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {tables.map((table) => (
              <Table.Tr key={table.id}>
                <Table.Td>{table.id}</Table.Td>
                <Table.Td>{table.capacity}</Table.Td>
                <Table.Td>
                  {zoneNameById[String(table.zoneId)] ?? table.zoneId}
                </Table.Td>
                <Table.Td>
                  <Badge
                    color={getStatusBadgeColor(table.status)}
                    variant="light"
                  >
                    {table.status}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  {table.status === "FREE" ? table.score : "—"}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        <TableMap model={tableMapModel} />
      </Stack>
    </Card>
  );
}
