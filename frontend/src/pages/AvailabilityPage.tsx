import { Card, Text, Title } from "@mantine/core";

export function AvailabilityPage() {
  return (
    <Card withBorder radius="md" p="md">
      <Title order={5}>Availability</Title>
      <Text c="dimmed" mt="xs">
        Filters and table map
      </Text>
    </Card>
  );
}
