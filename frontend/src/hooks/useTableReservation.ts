import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  type AvailabilityQuery,
  createReservation,
  getDishSuggestion,
} from "../api/restaurantApi";
import type { AvailabilityTableDto, DishSuggestion } from "../types/api";

type UseTableReservationParams = {
  selectedTable: AvailabilityTableDto | null;
  activeQuery: AvailabilityQuery | null;
  refetchAvailability: () => Promise<unknown>;
};

export type ReservationSuccessData = {
  reservationId: number;
  tableId: number;
  zoneId: number;
  capacity: number;
  start: string;
  partySize: number;
  durationMinutes: number;
  dishSuggestion: DishSuggestion | null;
};

export function useTableReservation({
  selectedTable,
  activeQuery,
  refetchAvailability,
}: UseTableReservationParams) {
  const [reservationError, setReservationError] = useState<string | null>(null);
  const [reservationSuccess, setReservationSuccess] =
    useState<ReservationSuccessData | null>(null);

  useEffect(() => {
    setReservationError(null);
  }, [selectedTable?.id]);

  const reserveMutation = useMutation({
    mutationFn: async () => {
      if (!selectedTable || !activeQuery) {
        throw new Error("Please search availability and select a table.");
      }

      const reservationId = await createReservation({
        tableId: selectedTable.id,
        start: activeQuery.start,
        partySize: activeQuery.partySize,
        durationMinutes: activeQuery.durationMinutes,
        preferences: activeQuery.preferences,
      });

      return {
        reservationId,
        table: selectedTable,
        query: activeQuery,
      };
    },
    onSuccess: async ({ reservationId, table, query }) => {
      setReservationError(null);

      let dishSuggestion: DishSuggestion | null;
      try {
        dishSuggestion = await getDishSuggestion();
      } catch {
        dishSuggestion = null;
      }

      setReservationSuccess({
        reservationId,
        tableId: table.id,
        zoneId: table.zoneId,
        capacity: table.capacity,
        start: query.start,
        partySize: query.partySize,
        durationMinutes: query.durationMinutes ?? 120,
        dishSuggestion,
      });

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
    reservationSuccess,
    closeReservationSuccess: () => setReservationSuccess(null),
  };
}
