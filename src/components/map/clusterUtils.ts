import Supercluster, { type AnyProps, type PointFeature } from "supercluster";
import type { Feature, Point } from "geojson";
import type { DetectionItemFragment } from "../../gql/graphql.ts";

export const detectionsToFeatures = (
  detections: DetectionItemFragment[],
): Feature<Point>[] => {
  return detections.map((d) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [d.coords.lon, d.coords.lat],
    },
    properties: {
      id: d.id,
      species: d.species.id,
    },
  }));
};

// Creates an index for each species
export const createSuperclusterIndices = (features: Feature<Point>[]) => {
  const indices: Record<string, Supercluster> = {};

  const uniqueSpecies = [
    ...new Set(features.map((f) => f.properties?.species as string)),
  ];

  uniqueSpecies.forEach((species) => {
    const index = new Supercluster({
      radius: 80,
      maxZoom: 14,
      minZoom: 0,
    });

    const speciesFeatures = features.filter(
      (f) => f.properties?.species === species,
    );
    index.load(speciesFeatures as PointFeature<AnyProps>[]);

    indices[species] = index;
  });

  return indices;
};

export const getCombinedClusters = (
  indices: Record<string, Supercluster>,
  bounds: [number, number, number, number],
  zoom: number,
): Feature<Point>[] => {
  let combined: Feature<Point>[] = [];

  Object.keys(indices).forEach((species) => {
    const index = indices[species];
    const results = index.getClusters(bounds, zoom);

    const taggedResults = results.map((f) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Supercluster can return null properties at runtime
      if (!f.properties) f.properties = {};
      f.properties.species = species;
      return f as Feature<Point>;
    });

    combined = [...combined, ...taggedResults];
  });

  return combined;
};
