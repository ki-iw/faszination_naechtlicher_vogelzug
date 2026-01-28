import {
  createContext,
  type PropsWithChildren,
  useMemo,
  useState,
  use,
} from "react";
import maplibregl from "maplibre-gl";

interface ContextValues {
  map: maplibregl.Map | null;
  setMap: (map: maplibregl.Map) => void;
}

export const MapContext = createContext<ContextValues | null>(null);

const MapProvider = ({ children }: PropsWithChildren) => {
  const [map, setMap] = useState<maplibregl.Map | null>(null);

  const contextValue = useMemo<ContextValues>(
    () => ({
      map,
      setMap,
    }),
    [map, setMap],
  );

  return <MapContext value={contextValue}>{children}</MapContext>;
};

export default MapProvider;

export const useMapContext = () => {
  const object = use(MapContext);
  if (!object) {
    throw new Error("useMapContext must be used within a Provider");
  }
  return object;
};
