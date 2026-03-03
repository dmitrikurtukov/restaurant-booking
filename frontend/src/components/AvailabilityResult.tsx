import {
  Alert,
  Badge,
  Card,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import type { UseQueryResult } from "@tanstack/react-query";
import type { AvailabilityResponse } from "../types/api";

type AvailabilityResultProps = {
  hasSubmitted: boolean;
  availabilityQuery: UseQueryResult<AvailabilityResponse, Error>;
};

export function AvailabilityResult({
  hasSubmitted,
  availabilityQuery,
}: Readonly<AvailabilityResultProps>) {
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

  const { recommendedTableId, topRecommendations, tables } =
    availabilityQuery.data;

  return (
    <Card withBorder radius="md" p="md">
      <Stack gap="xs">
        <Title order={5}>Availability Result</Title>

        <Text>
          Recommended table:{" "}
          <Text span fw={700}>
            {recommendedTableId ?? "None"}
          </Text>
        </Text>

        <Group gap="xs">
          <Text>Top 3:</Text>
          {topRecommendations.length ? (
            topRecommendations.map((id) => (
              <Badge key={id} variant="light">
                {id}
              </Badge>
            ))
          ) : (
            <Text c="dimmed">None</Text>
          )}
        </Group>

        <Text>
          Tables returned:{" "}
          <Text span fw={700}>
            {tables.length}
          </Text>
        </Text>
      </Stack>
    </Card>
  );
}
