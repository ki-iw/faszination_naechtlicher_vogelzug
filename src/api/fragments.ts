import { gql } from "../gql";

export const DetectionItem = gql(`
  fragment DetectionItem on Detection {
    id
    species {
      id
      scientificName
    }
    timestamp
    coords {
      lat
      lon
    }
  }
`);

export const SpeciesItem = gql(`
  fragment SpeciesItem on Species {
    scientificName
    id
    imageUrl
    imageLicense
    imageLicenseUrl
    imageCredit
    commonName
    translations {
      locale
      commonName
    }
  }
`);
