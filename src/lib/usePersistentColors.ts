import { useState, useEffect } from "react";

export function usePersistentColors(
  selectedSpecies: string[],
  palette: string[],
) {
  const [colorMap, setColorMap] = useState<Record<string, string>>({});

  useEffect(() => {
    setColorMap((prev) => {
      const next = { ...prev };

      Object.keys(next).forEach((id) => {
        if (!selectedSpecies.includes(id)) {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete next[id];
        }
      });

      selectedSpecies.forEach((id) => {
        if (!next[id]) {
          const usedColors = Object.values(next);

          const availableColor = palette.find((c) => !usedColors.includes(c));

          if (availableColor) {
            next[id] = availableColor;
          }
        }
      });

      return next;
    });
  }, [selectedSpecies, palette]);

  return colorMap;
}
