import dayjs from "dayjs";
import { useMemo } from "react";
import { GET_DETECTIONS } from "./queries.ts";
import type { InputLocation } from "../gql/graphql.ts";
import { useQuery } from "@apollo/client/react";
import { isNotNull } from "../lib/isNotNull.ts";
import { useDatesContext } from "../components/DatesProvider.tsx";

const BATCH_SIZE = 20000;
const toIso = (d: dayjs.Dayjs) => d.startOf("minute").toISOString();

export function useDetections(
  bounds: { ne: InputLocation; sw: InputLocation },
  species: string[],
) {
  const { visualisationTimeRange: period } = useDatesContext();
  const fetchVariables = useMemo(
    () => ({
      ...bounds,
      period: {
        from: toIso(period.from.startOf("day")),
        to: toIso(period.from.endOf("day")), // ← Tagesende
      },
      first: BATCH_SIZE,
      species: [...species].sort(),
    }),
    [
      bounds.ne.lat,
      bounds.ne.lon,
      bounds.sw.lat,
      bounds.sw.lon,
      period.from.format("YYYY-MM-DD"),
      species.join(","),
    ],
  );

  const { data, loading, error, client } = useQuery(GET_DETECTIONS, {
    variables: fetchVariables,
    skip: species.length === 0,
    notifyOnNetworkStatusChange: false,
    fetchPolicy: "cache-and-network",
  });

  const filteredDetections = useMemo(() => {
    if (!data?.detections.nodes) return [];

    const nodes = data.detections.nodes.filter(isNotNull);

    return nodes.filter((detection) => {
      const detectionTime = dayjs(detection.timestamp);
      return (
        detectionTime.isSameOrAfter(period.from) &&
        detectionTime.isBefore(period.to)
      );
    });
  }, [data, period.from.valueOf(), period.to.valueOf()]);

  const prefetch = (vars?: {
    period?: { from: dayjs.Dayjs; to: dayjs.Dayjs };
  }) => {
    if (!vars?.period) return;

    const prefetchVars = {
      ...fetchVariables,
      period: {
        from: toIso(vars.period.from.startOf("day")),
        to: toIso(vars.period.from.endOf("day")),
      },
    };

    client
      .query({
        query: GET_DETECTIONS,
        variables: prefetchVars,
        fetchPolicy: "cache-first",
      })
      .catch(console.error);
  };

  return {
    data: filteredDetections,
    loading,
    error,
    prefetch,
  };
}
