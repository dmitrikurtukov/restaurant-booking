import type { AvailabilityTableDto } from "../types/api";

export type ZoneArea = {
  zoneId: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke: string;
};

export type TableMarker = {
  id: number;
  label: string;
  cx: number;
  cy: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
};

export type TableMapModel = {
  svgWidth: number;
  svgHeight: number;
  zoneAreas: ZoneArea[];
  tableMarkers: TableMarker[];
};

type CreateTableMapModelParams = {
  tables: AvailabilityTableDto[];
  recommendedTableId: number | null;
  topRecommendations: number[];
  zoneNameById: Record<string, string>;
};

const SVG_WIDTH = 640;
const SVG_HEIGHT = 360;
const TABLE_RADIUS = 16;

const ZONE_PADDING_X = 34;
const ZONE_PADDING_Y = 34;
const ZONE_LABEL_BAND = 24;
const MIN_ZONE_HEIGHT = 108;
const SVG_SAFE_PADDING = 8;

const ZONE_COLORS = [
  { fill: "#e7f5ff", stroke: "#1c7ed6" },
  { fill: "#fff4e6", stroke: "#d9480f" },
  { fill: "#ebfbee", stroke: "#2b8a3e" },
  { fill: "#f8f0fc", stroke: "#862e9c" },
];

export const tableMapConstants = {
  svgWidth: SVG_WIDTH,
  svgHeight: SVG_HEIGHT,
  tableRadius: TABLE_RADIUS,
};

function toCanvasX(x: number): number {
  return x * 2 + 40;
}

function toCanvasY(y: number): number {
  return y * 1.6 + 40;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function zoneColorById(zoneId: number) {
  const index =
    (((zoneId - 1) % ZONE_COLORS.length) + ZONE_COLORS.length) %
    ZONE_COLORS.length;
  return ZONE_COLORS[index];
}

function tableFill(status: AvailabilityTableDto["status"]): string {
  if (status === "FREE") return "#40c057";
  if (status === "OCCUPIED") return "#fa5252";
  return "#868e96";
}

export function createTableMapModel({
  tables,
  recommendedTableId,
  topRecommendations,
  zoneNameById,
}: CreateTableMapModelParams): TableMapModel {
  const grouped = new Map<number, AvailabilityTableDto[]>();
  for (const table of tables) {
    const current = grouped.get(table.zoneId);
    if (current) current.push(table);
    else grouped.set(table.zoneId, [table]);
  }

  const zoneAreas: ZoneArea[] = [];
  for (const [zoneId, zoneTables] of grouped.entries()) {
    const name = zoneNameById[String(zoneId)] ?? `Zone ${zoneId}`;
    const color = zoneColorById(zoneId);

    const xs = zoneTables.map((t) => toCanvasX(t.xPosition));
    const ys = zoneTables.map((t) => toCanvasY(t.yPosition));

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    let x = minX - ZONE_PADDING_X;
    let y = minY - ZONE_PADDING_Y - ZONE_LABEL_BAND;
    let width = maxX - minX + ZONE_PADDING_X * 2;
    let height = maxY - minY + ZONE_PADDING_Y * 2 + ZONE_LABEL_BAND;

    const minWidthFromLabel = Math.max(120, name.length * 8 + 24);
    if (width < minWidthFromLabel) {
      const extra = minWidthFromLabel - width;
      x -= extra / 2;
      width = minWidthFromLabel;
    }

    if (height < MIN_ZONE_HEIGHT) {
      const extra = MIN_ZONE_HEIGHT - height;
      y -= extra / 2;
      height = MIN_ZONE_HEIGHT;
    }

    x = clamp(x, SVG_SAFE_PADDING, SVG_WIDTH - SVG_SAFE_PADDING - width);
    y = clamp(y, SVG_SAFE_PADDING, SVG_HEIGHT - SVG_SAFE_PADDING - height);

    zoneAreas.push({
      zoneId,
      name,
      x,
      y,
      width,
      height,
      fill: color.fill,
      stroke: color.stroke,
    });
  }

  const topSet = new Set(topRecommendations);

  const tableMarkers: TableMarker[] = tables.map((table) => {
    const isRecommended = table.id === recommendedTableId;
    const isTop = topSet.has(table.id);

    const baseStroke = isTop ? 3 : 2;
    const strokeWidth = isRecommended ? 4 : baseStroke;

    return {
      id: table.id,
      label: String(table.capacity),
      cx: toCanvasX(table.xPosition),
      cy: toCanvasY(table.yPosition),
      fill: tableFill(table.status),
      stroke: isRecommended ? "#228be6" : "#495057",
      strokeWidth,
      opacity: table.status === "OCCUPIED" ? 0.9 : 1,
    };
  });

  return {
    svgWidth: SVG_WIDTH,
    svgHeight: SVG_HEIGHT,
    zoneAreas,
    tableMarkers,
  };
}
