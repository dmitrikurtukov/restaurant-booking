import type { DishSuggestion } from "../types/api.ts";
import { Anchor, Card, Stack, Text } from "@mantine/core";

interface DishSuggestionCardProps {
  dishSuggestion: DishSuggestion;
}

export function DishSuggestionCard({
  dishSuggestion,
}: Readonly<DishSuggestionCardProps>) {
  return (
    <Card withBorder radius="md" p="sm" mt="xs">
      <Stack gap={6}>
        <Text fw={600}>Suggested dish</Text>
        <Text>{dishSuggestion.name}</Text>
        {(dishSuggestion.category || dishSuggestion.cuisine) && (
          <Text size="sm" c="dimmed">
            {[dishSuggestion.category, dishSuggestion.cuisine]
              .filter(Boolean)
              .join(" • ")}
          </Text>
        )}
        {dishSuggestion.sourceUrl && (
          <Anchor
            href={dishSuggestion.sourceUrl}
            target="_blank"
            rel="noreferrer"
            size="sm"
          >
            View recipe
          </Anchor>
        )}
      </Stack>
    </Card>
  );
}
