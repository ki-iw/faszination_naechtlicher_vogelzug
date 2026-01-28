import { useApolloClient, useQuery } from "@apollo/client/react";
import { GET_SPECIES } from "../api/queries.ts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useMapContext } from "./MapProvider.tsx";
import { useDatesContext } from "./DatesProvider.tsx";
import { isNotNull } from "../lib/isNotNull.ts";
import { buildAvailableSpeciesQuery } from "../lib/buildAvailableSpeciesQuery.ts";

const useAvailableSpecies = (selectedSpecies: string[]) => {
  const { map } = useMapContext();
  const { dateRange } = useDatesContext();
  const client = useApolloClient();
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const { data: hardcodedSpecies } = useQuery(GET_SPECIES, {
    fetchPolicy: "cache-and-network",
  });

  const topThreeSpecies = useMemo(
    () =>
      [
        hardcodedSpecies?.species1,
        hardcodedSpecies?.species2,
        hardcodedSpecies?.species3,
      ]
        .filter(isNotNull)
        .map((s) => s.id),
    [hardcodedSpecies],
  );

  const updateAvailableSpecies = useCallback(async () => {
    if (!map) return;

    setLoading(true);

    const bounds = map.getBounds();
    const speciesToCheck = Array.from(
      new Set([...selectedSpecies, ...topThreeSpecies]),
    );

    if (speciesToCheck.length === 0) {
      setAvailability({});
      setLoading(false);
      return;
    }

    try {
      const query = buildAvailableSpeciesQuery(speciesToCheck);

      const { data } = await client.query<
        Record<string, { totalCount: number }>
      >({
        query,
        variables: {
          ne: {
            lon: bounds.getNorthEast().lng,
            lat: bounds.getNorthEast().lat,
          },
          sw: {
            lon: bounds.getSouthWest().lng,
            lat: bounds.getSouthWest().lat,
          },
          period: {
            from: dateRange.from.toISOString(),
            to: dateRange.to.toISOString(),
          },
        },
        fetchPolicy: "network-only",
      });

      if (!data) {
        setLoading(false);
        return;
      }

      const newAvailability = speciesToCheck.reduce<Record<string, boolean>>(
        (acc, id) => {
          acc[id] = data[`species_${id}`].totalCount > 0;
          return acc;
        },
        {},
      );

      setAvailability(newAvailability);
    } catch (error) {
      console.error("Error fetching available species:", error);
    } finally {
      setLoading(false);
    }
  }, [map, selectedSpecies, topThreeSpecies, dateRange, client]);

  useEffect(() => {
    if (!map) return;

    const handleMoveEnd = () => {
      updateAvailableSpecies().catch(console.error);
    };

    updateAvailableSpecies().catch(console.error); // Initial
    map.on("moveend", handleMoveEnd);

    return () => {
      map.off("moveend", handleMoveEnd); // Richtige Referenz!
    };
  }, [map, updateAvailableSpecies]);

  return { availability, loading };
};

export default useAvailableSpecies;
