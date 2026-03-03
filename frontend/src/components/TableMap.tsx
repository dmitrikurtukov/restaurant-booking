import { Badge, Card, Group, Stack, Text, Title } from "@mantine/core";
import type { AvailabilityTableDto } from "../types/api";

type TableMapProps = {
  tables: AvailabilityTableDto[];
  recommendedTableId: number | null;
  topRecommendations: number[];
};

const SVG_WIDTH = 640;
const SVG_HEIGHT = 360;
const TABLE_RADIUS = 16;

function getTableColor(status: AvailabilityTableDto["status"]): string {
  if (status === "FREE") return "#40c057";
  if (status === "OCCUPIED") return "#fa5252";
  return "#868e96";
}

export function TableMap({
  tables,
  recommendedTableId,
  topRecommendations,
}: Readonly<TableMapProps>) {
  return (
    <Card withBorder radius="md" p="md">
      <Stack gap="md">
        <Title order={5}>Floor Plan</Title>

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
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          role="img"
          aria-label="Restaurant table map"
          style={{
            border: "1px solid #dee2e6",
            borderRadius: 8,
            background: "#f8f9fa",
          }}
        >
          {tables.map((table) => {
            const cx = table.xPosition * 2 + 40;
            const cy = table.yPosition * 1.6 + 40;

            const isRecommended = table.id === recommendedTableId;
            const isTop = topRecommendations.includes(table.id);

            const baseWidth = isTop ? 3 : 2;
            const strokeWidth = isRecommended ? 4 : baseWidth;

            return (
              <g key={table.id}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={TABLE_RADIUS}
                  fill={getTableColor(table.status)}
                  stroke={isRecommended ? "#228be6" : "#495057"}
                  strokeWidth={strokeWidth}
                  opacity={table.status === "OCCUPIED" ? 0.85 : 1}
                />
                <text
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="700"
                  fill="#fff"
                >
                  {table.id}
                </text>
              </g>
            );
          })}
        </svg>

        <Text size="sm" c="dimmed">
          Blue border = recommended table, thicker border = top recommendations.
        </Text>
      </Stack>
    </Card>
  );
}
