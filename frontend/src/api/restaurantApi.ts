import { apiClient } from "./client";
import type {
  AvailabilityResponse,
  CreateReservationRequest,
  DishSuggestion,
  LayoutResponse,
  TablePreference,
} from "../types/api";

export interface AvailabilityQuery {
  start: string;
  partySize: number;
  zoneId?: number;
  preferences?: TablePreference[];
  durationMinutes?: number;
}

export async function getLayout(): Promise<LayoutResponse> {
  const { data } = await apiClient.get<LayoutResponse>("/api/layout");
  return data;
}

export function toAvailabilitySearchParams(
  query: AvailabilityQuery,
): URLSearchParams {
  const params = new URLSearchParams({
    start: query.start,
    partySize: String(query.partySize),
    durationMinutes: String(query.durationMinutes ?? 120),
  });

  if (query.zoneId != null) params.set("zoneId", String(query.zoneId));
  if (query.preferences?.length)
    params.set("preferences", query.preferences.join(","));

  return params;
}

export async function getAvailability(
  query: AvailabilityQuery,
): Promise<AvailabilityResponse> {
  const params = toAvailabilitySearchParams(query);
  const { data } = await apiClient.get<AvailabilityResponse>(
    `/api/availability?${params.toString()}`,
  );
  return data;
}

export async function createReservation(
  payload: CreateReservationRequest,
): Promise<number> {
  const { data } = await apiClient.post<number>("/api/reservations", payload);
  return data;
}

export async function getDishSuggestion(): Promise<DishSuggestion> {
  const { data } = await apiClient.get<DishSuggestion>("/api/dish-suggestion");
  return data;
}
