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

  return {
    zoneOptions,
    isError: layoutQuery.isError,
    isLoading: layoutQuery.isLoading,
  };
}
