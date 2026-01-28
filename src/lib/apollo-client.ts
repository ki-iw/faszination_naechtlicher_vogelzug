import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";

const httpLink = new HttpLink({
  uri: "https://app.birdweather.com/graphql",
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        detections: {
          keyArgs: ["ne", "sw", "species", "@connection", ["key"]],
          merge(_existing, incoming) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- Apollo's merge API is untyped
            return incoming;
          },
        },
        timeOfDayDetectionCounts: {
          keyArgs: ["ne", "sw", "period"],
          merge(_existing, incoming) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- Apollo's merge API is untyped
            return incoming;
          },
        },
      },
    },
    Detection: {
      keyFields: ["id"],
    },
    Species: {
      keyFields: ["id"],
    },
  },
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: cache,
});
