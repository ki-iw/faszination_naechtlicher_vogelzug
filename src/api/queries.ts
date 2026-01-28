import { gql } from "../gql";
import "./fragments";

export const GET_DETECTIONS = gql(`
    query detections(
      $ne: InputLocation!
      $sw: InputLocation!
      $period: InputDuration
      $after: String
      $species: [ID!]
      $first: Int
    ) {
      detections(
        ne: $ne
        sw: $sw
        period: $period
        after: $after
        first: $first
        scoreGte: 0.5
        speciesIds: $species
      ) {
        nodes {
          ...DetectionItem
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
`);

export const GET_SPECIES = gql(`
    query species {
      species1: species(
        scientificName: "Grus grus"
      ) {
        ...SpeciesItem
      }
      species2: species(
        scientificName: "Numenius arquata"
      ) {
        ...SpeciesItem
      }
      species3: species(
        scientificName: "Turdus iliacus"
      ) {
        ...SpeciesItem
      }
    }
`);

export const SEARCH_SPECIES = gql(`
  query SearchSpecies($query: String!, $searchLocale: String) {
    searchSpecies(query: $query, searchLocale: $searchLocale) {
      nodes {
        ...SpeciesItem
      }
    }
  }
`);
