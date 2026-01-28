// lib/buildAvailableSpeciesQuery.ts
import { gql } from "@apollo/client";

export const buildAvailableSpeciesQuery = (speciesIds: string[]) => {
  const aliasedQueries = speciesIds
    .map(
      (id) => `
        species_${id}: detections(
          speciesIds: ["${id}"]
          ne: $ne
          sw: $sw
          period: $period
        ) {
          totalCount
        }
      `,
    )
    .join("\n");

  return gql`
    query AvailableSpecies(
      $ne: InputLocation!
      $sw: InputLocation!
      $period: InputDuration
    ) {
      ${aliasedQueries}
    }
  `;
};
