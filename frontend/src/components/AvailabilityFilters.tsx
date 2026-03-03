import {
  Alert,
  Button,
  Card,
  Grid,
  MultiSelect,
  NumberInput,
  Select,
  Stack,
  Title,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { CircleAlert, Search } from "lucide-react";
import { useAvailabilityFilters } from "../hooks/useAvailabilityFilters";
import type { AvailabilityFiltersValues } from "../types/availability";
import type { TablePreference } from "../types/api.ts";

const preferenceOptions: Array<{ value: TablePreference; label: string }> = [
  { value: "QUIET", label: "Quiet" },
  { value: "WINDOW", label: "Window" },
  { value: "NEAR_KIDS", label: "Near kids area" },
  { value: "ACCESSIBLE", label: "Accessible" },
];

type AvailabilityFiltersProps = {
  onSubmit: (filters: AvailabilityFiltersValues) => void;
  zoneOptions: Array<{ value: string; label: string }>;
};

export function AvailabilityFilters({
  onSubmit,
  zoneOptions,
}: Readonly<AvailabilityFiltersProps>) {
  const {
    filters,
    setStart,
    setPartySize,
    setDurationMinutes,
    setZoneId,
    setPreferences,
    errorMessage,
    validate,
  } = useAvailabilityFilters();

  const handleFindTables = () => {
    if (!validate()) return;
    onSubmit(filters);
  };

  return (
    <Card withBorder radius="md" p="md">
      <Stack gap="md">
        <Title order={5}>Find Available Tables</Title>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <DateTimePicker
              label="Date and time"
              placeholder="Pick date and time"
              value={filters.start}
              onChange={setStart}
              clearable={false}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 6, md: 3 }}>
            <NumberInput
              label="Party size"
              min={1}
              max={20}
              value={filters.partySize}
              onChange={(value) => setPartySize(Number(value) || 1)}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 6, md: 3 }}>
            <NumberInput
              label="Duration (min)"
              min={1}
              max={300}
              value={filters.durationMinutes}
              onChange={(value) => setDurationMinutes(Number(value) || 120)}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Zone (optional)"
              placeholder="Any zone"
              data={zoneOptions}
              value={filters.zoneId}
              onChange={setZoneId}
              clearable
              searchable
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <MultiSelect
              label="Preferences (optional)"
              placeholder="Select preferences"
              data={preferenceOptions}
              value={filters.preferences}
              onChange={(values) => setPreferences(values as TablePreference[])}
              clearable
            />
          </Grid.Col>
        </Grid>

        {errorMessage && (
          <Alert
            color="red"
            icon={<CircleAlert size={16} />}
            styles={{
              icon: { marginRight: "4px" },
            }}
          >
            {errorMessage}
          </Alert>
        )}

        <Button
          leftSection={<Search size={16} />}
          w="fit-content"
          onClick={handleFindTables}
        >
          Find tables
        </Button>
      </Stack>
    </Card>
  );
}
