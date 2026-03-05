export type TablePreference = "QUIET" | "WINDOW" | "NEAR_KIDS" | "ACCESSIBLE";
export type TableStatus = "FREE" | "OCCUPIED" | "TOO_SMALL";

export interface LayoutTableDto {
  id: number;
  capacity: number;
  xPosition: number;
  yPosition: number;
  zoneId: number;
  features: TablePreference[];
}

export interface LayoutZoneDto {
  id: number;
  name: string;
  tables: LayoutTableDto[];
}

export interface LayoutResponse {
  zones: LayoutZoneDto[];
}

export interface AvailabilityTableDto {
  id: number;
  capacity: number;
  xPosition: number;
  yPosition: number;
  zoneId: number;
  status: TableStatus;
  score: number;
}

export interface AvailabilityResponse {
  tables: AvailabilityTableDto[];
  recommendedTableId: number | null;
  topRecommendations: number[];
}

export interface CreateReservationRequest {
  tableId: number;
  start: string;
  partySize: number;
  durationMinutes?: number;
  preferences?: TablePreference[];
}

export interface DishSuggestion {
  name: string;
  category: string | null;
  cuisine: string | null;
  imageUrl: string | null;
  sourceUrl: string | null;
}
