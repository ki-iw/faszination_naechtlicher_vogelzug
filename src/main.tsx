import r2wc from "@r2wc/react-to-web-component";
import "./index.css";
import App from "./App.tsx";
import { apolloClient } from "./lib/apollo-client.ts";
import { ApolloProvider } from "@apollo/client/react";
import DatesProvider from "./components/DatesProvider.tsx";
import MapProvider from "./components/MapProvider.tsx";

const ZugBirdNet = () => (
  <ApolloProvider client={apolloClient}>
    <DatesProvider>
      <MapProvider>
        <App />
      </MapProvider>
    </DatesProvider>
  </ApolloProvider>
);

customElements.define("zug-birdnet", r2wc(ZugBirdNet));
