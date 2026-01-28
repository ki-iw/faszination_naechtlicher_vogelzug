import type { Species } from "../gql/graphql.ts";

export function getTranslatedSpeciesName(species: Species, locale = "de") {
  return (
    species.translations.find((s) => s.locale === locale)?.commonName ??
    species.scientificName
  );
}
