import { useMemo, useState } from "react";
import Map from "./components/map/Map.tsx";
import Timeline from "./components/Timeline";
import { useDetections } from "./api/useDetections.ts";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import SpeciesDropdown from "./components/SpeciesDropdown.tsx";
import { MapLoadingIndicator } from "./components/MapLoadingIndicator.tsx";
import { usePersistentColors } from "./lib/usePersistentColors.ts";
import LayersDropdown from "./components/LayersDropdown.tsx";

const bounds = {
  ne: { lat: 50.5644529365, lon: 8.9771580802 },
  sw: { lat: 47.2703623267, lon: 13.8350427083 },
};

export const selectionColors = ["#FF29B4", "#64BEFF", "#00FFCC", "#FFD700"];

function App() {
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const { data: detections, loading } = useDetections(bounds, selectedSpecies);
  const speciesColors = usePersistentColors(selectedSpecies, selectionColors);

  const filteredDetections = useMemo(() => {
    // Remove species that the user has deselected, without waiting for the fetch to finish
    return detections.filter((d) => selectedSpecies.includes(d.species.id));
  }, [detections, selectedSpecies.join(",")]);

  return (
    <StyleProvider layer>
      <ConfigProvider
        theme={{
          token: {
            colorTextQuaternary: "#fff",
          },
        }}
      >
        <div className="flex flex-col h-screen relative">
          <MapLoadingIndicator loading={loading} />
          <div className="absolute top-4 left-4 z-10 flex items-start gap-4">
            <SpeciesDropdown
              selectedSpecies={selectedSpecies}
              onChangeSpecies={setSelectedSpecies}
              speciesColors={speciesColors}
            />
            <LayersDropdown />
          </div>
          <Map
            detections={filteredDetections}
            selectedSpecies={selectedSpecies}
            speciesColors={speciesColors}
          />
          <Timeline />
        </div>
      </ConfigProvider>
    </StyleProvider>
  );
}

export default App;
