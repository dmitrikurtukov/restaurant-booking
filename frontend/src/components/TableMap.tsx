import { Badge, Card, Group, Stack, Text, Title } from "@mantine/core";
import type { TableMapModel } from "../lib/tableMapModel";
import { tableMapConstants } from "../lib/tableMapModel";

type TableMapProps = {
  model: TableMapModel;
};

export function TableMap({ model }: Readonly<TableMapProps>) {
  return (
    <Card withBorder radius="md" p="md">
      <Stack gap="md">
        <Title order={5}>Table Plan by Zones</Title>

        <Group gap="xs">
          <Badge color="green" variant="light">
            Free
          </Badge>
          <Badge color="red" variant="light">
            Occupied
          </Badge>
          <Badge color="gray" variant="light">
            Too small
          </Badge>
          <Badge color="blue" variant="light">
            Recommended
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

          {model.tableMarkers.map((marker) => (
            <g key={marker.id}>
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
                {marker.id}
              </text>
            </g>
          ))}
        </svg>

        <Text size="sm" c="dimmed">
          Blue border = recommended table. Thicker border = top recommendations.
        </Text>
      </Stack>
    </Card>
  );
}
