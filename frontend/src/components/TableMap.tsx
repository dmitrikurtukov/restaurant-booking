import { Badge, Card, Group, Stack, Text, Title } from "@mantine/core";
import type { TableMapModel } from "../lib/tableMapModel";
import { tableMapConstants } from "../lib/tableMapModel";

type TableMapProps = {
  model: TableMapModel;
  selectedTableId: number | null;
  onSelectTable: (tableId: number) => void;
};

export function TableMap({
  model,
  selectedTableId,
  onSelectTable,
}: Readonly<TableMapProps>) {
  return (
    <Card withBorder radius="md" p="md">
      <Stack gap="md">
        <Title order={5}>Table Plan by Zones</Title>

        <Group gap="xs">
          <Badge color="green" variant="light">
            Available
          </Badge>
          <Badge color="red" variant="light">
            Occupied
          </Badge>
          <Badge color="gray" variant="light">
            Too small
          </Badge>
        </Group>

        <svg
          width="100%"
          viewBox={`0 0 ${model.svgWidth} ${model.svgHeight}`}
          role="img"
          aria-label="Restaurant table map by zones"
          style={{
            border: "1px solid #dee2e6",
            borderRadius: 8,
            background: "#f8f9fa",
          }}
        >
          {model.zoneAreas.map((area) => (
            <g key={`zone-${area.zoneId}`}>
              <rect
                x={area.x}
                y={area.y}
                width={area.width}
                height={area.height}
                rx={12}
                fill={area.fill}
                stroke={area.stroke}
                strokeWidth={1.5}
                opacity={0.45}
              />
              <text
                x={area.x + 10}
                y={area.y + 18}
                fontSize="12"
                fontWeight="700"
                fill={area.stroke}
              >
                {area.name}
              </text>
            </g>
          ))}

          {model.tableMarkers.map((marker) => {
            const isSelected = marker.id === selectedTableId;

            return (
              <g
                key={marker.id}
                onClick={() => onSelectTable(marker.id)}
                style={{ cursor: "pointer" }}
              >
                {isSelected && (
                  <circle
                    cx={marker.cx}
                    cy={marker.cy}
                    r={tableMapConstants.tableRadius + 5}
                    fill="none"
                    stroke="#111827"
                    strokeWidth={2}
                    opacity={0.95}
                  />
                )}
                <circle
                  cx={marker.cx}
                  cy={marker.cy}
                  r={tableMapConstants.tableRadius}
                  fill={marker.fill}
                  stroke={marker.stroke}
                  strokeWidth={marker.strokeWidth}
                  opacity={marker.opacity}
                />
                <text
                  x={marker.cx}
                  y={marker.cy + 4}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="700"
                  fill="#fff"
                >
                  {marker.label}
                </text>
              </g>
            );
          })}
        </svg>

        <Text size="sm" c="dimmed">
          Click a table to view details. Number inside table = seats.
        </Text>
        <Text size="sm" c="dimmed">
          Border guide: blue = recommended, thicker = top recommendation, outer
          dark ring = selected table.
        </Text>
      </Stack>
    </Card>
  );
}
