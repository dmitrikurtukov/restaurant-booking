import {
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
import { Search } from "lucide-react";

const zoneOptions = [
  { value: "1", label: "Main Hall" },
  { value: "2", label: "Terrace" },
  { value: "3", label: "Private Room" },
];

const preferenceOptions = [
  { value: "QUIET", label: "Quiet" },
  { value: "WINDOW", label: "Window" },
  { value: "NEAR_KIDS", label: "Near kids area" },
  { value: "ACCESSIBLE", label: "Accessible" },
];

export function AvailabilityFilters() {
  return (
    <Card withBorder radius="md" p="md">
      <Stack gap="md">
        <Title order={5}>Find Available Tables</Title>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <DateTimePicker
              label="Date and time"
              placeholder="Pick date and time"
              clearable={false}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 6, md: 3 }}>
            <NumberInput label="Party size" min={1} max={20} defaultValue={2} />
          </Grid.Col>

          <Grid.Col span={{ base: 6, md: 3 }}>
            <NumberInput
              label="Duration (min)"
              min={1}
              max={300}
              defaultValue={120}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              label="Zone (optional)"
              placeholder="Any zone"
              data={zoneOptions}
              clearable
              searchable
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <MultiSelect
              label="Preferences (optional)"
              placeholder="Select preferences"
              data={preferenceOptions}
              clearable
            />
          </Grid.Col>
        </Grid>

        <Button leftSection={<Search size={16} />} w="fit-content">
          Find tables
        </Button>
      </Stack>
    </Card>
  );
}
