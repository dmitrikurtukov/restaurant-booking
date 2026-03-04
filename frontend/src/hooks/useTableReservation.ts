import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  type AvailabilityQuery,
  createReservation,
} from "../api/restaurantApi";
import type { AvailabilityTableDto } from "../types/api";
import { toast } from "react-toastify";

type UseTableReservationParams = {
  selectedTable: AvailabilityTableDto | null;
  activeQuery: AvailabilityQuery | null;
  refetchAvailability: () => Promise<unknown>;
};

export function useTableReservation({
  selectedTable,
  activeQuery,
  refetchAvailability,
}: UseTableReservationParams) {
  const [reservationError, setReservationError] = useState<string | null>(null);

  useEffect(() => {
    setReservationError(null);
  }, [selectedTable?.id]);

  const reserveMutation = useMutation({
    mutationFn: async () => {
      if (!selectedTable || !activeQuery) {
        throw new Error("Please search availability and select a table.");
      }

      return createReservation({
        tableId: selectedTable.id,
        start: activeQuery.start,
        partySize: activeQuery.partySize,
        durationMinutes: activeQuery.durationMinutes,
        preferences: activeQuery.preferences,
      });
    },
    onSuccess: async () => {
      setReservationError(null);
      toast.success("Reservation created successfully!");
      await refetchAvailability();
    },
    onError: (error: Error) => {
      setReservationError(error.message || "Could not create reservation.");
    },
  });

  return {
    canReserve: Boolean(selectedTable?.status === "FREE"),
    isReserving: reserveMutation.isPending,
    reserveTable: () => reserveMutation.mutate(),
    reservationError,
  };
}
