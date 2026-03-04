import { useEffect, useMemo, useState } from "react";
import { createTableMapModel } from "../lib/tableMapModel";
import type { AvailabilityResponse } from "../types/api";

type UseAvailabilityMapViewParams = {
  data: AvailabilityResponse | undefined;
  zoneNameById: Record<string, string>;
};

export function useAvailabilityMapView({
  data,
  zoneNameById,
}: UseAvailabilityMapViewParams) {
  const tables = data?.tables ?? [];
  const recommendedTableId = data?.recommendedTableId ?? null;
  const topRecommendations = data?.topRecommendations ?? [];

  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);

  useEffect(() => {
    if (!data) return;
    setSelectedTableId(recommendedTableId ?? data.tables[0]?.id ?? null);
  }, [data, recommendedTableId]);

  const selectedTable = useMemo(
    () => tables.find((table) => table.id === selectedTableId) ?? null,
    [tables, selectedTableId],
  );

  const tableMapModel = useMemo(
    () =>
      createTableMapModel({
        tables,
        recommendedTableId,
        topRecommendations,
        zoneNameById,
      }),
    [tables, recommendedTableId, topRecommendations, zoneNameById],
  );

  return {
    tableMapModel,
    selectedTableId,
    setSelectedTableId,
    selectedTable,
    recommendedTableId,
    topRecommendations,
  };
}
