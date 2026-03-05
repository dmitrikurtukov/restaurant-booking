import { Badge, Button, Group, Modal, Stack, Text, Title } from "@mantine/core";
import { DishSuggestionCard } from "./DishSuggestionCard.tsx";
import type { ReservationSuccessData } from "../hooks/useTableReservation.ts";

type ReservationSuccessModalProps = {
  opened: boolean;
  successData: ReservationSuccessData | null;
  zoneNameById: Record<string, string>;
  onClose: () => void;
};

export function ReservationSuccessModal({
  opened,
  successData,
  zoneNameById,
  onClose,
}: Readonly<ReservationSuccessModalProps>) {
  if (!successData) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Reservation confirmed"
      centered
    >
      <Stack gap="md">
        <Title order={5}>Reservation #{successData.reservationId}</Title>

        <Group gap="xs">
          <Text fw={600}>Table:</Text>
          <Badge variant="light" color="blue">
            #{successData.tableId}
          </Badge>
        </Group>

        <Text size="sm">
          Zone:{" "}
          <Text span fw={600}>
            {zoneNameById[String(successData.zoneId)] ??
              `Zone ${successData.zoneId}`}
          </Text>
        </Text>
        <Text size="sm">
          Seats:{" "}
          <Text span fw={600}>
            {successData.capacity}
          </Text>
        </Text>
        <Text size="sm">
          Party size:{" "}
          <Text span fw={600}>
            {successData.partySize}
          </Text>
        </Text>
        <Text size="sm">
          Duration:{" "}
          <Text span fw={600}>
            {successData.durationMinutes} min
          </Text>
        </Text>

        {successData.dishSuggestion && (
          <DishSuggestionCard dishSuggestion={successData.dishSuggestion} />
        )}

        <Button onClick={onClose}>Done</Button>
      </Stack>
    </Modal>
  );
}
