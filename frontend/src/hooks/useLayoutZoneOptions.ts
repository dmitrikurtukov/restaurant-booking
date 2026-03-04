import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLayout } from "../api/restaurantApi";
import { queryKeys } from "../api/queryKeys";

export function useLayoutZoneOptions() {
  const layoutQuery = useQuery({
    queryKey: queryKeys.layout,
    queryFn: getLayout,
  });

  const zoneOptions = useMemo(() => {
    if (!layoutQuery.data) return [];
    return layoutQuery.data.zones.map((zone) => ({
      value: String(zone.id),
      label: zone.name,
    }));
  }, [layoutQuery.data]);

  const zoneNameById = useMemo(() => {
    if (!layoutQuery.data) return {} as Record<string, string>;

    return Object.fromEntries(
      layoutQuery.data.zones.map((zone) => [String(zone.id), zone.name]),
    );
  }, [layoutQuery.data]);

  return {
    zoneOptions,
    zoneNameById,
    isError: layoutQuery.isError,
    isLoading: layoutQuery.isLoading,
  };
}
