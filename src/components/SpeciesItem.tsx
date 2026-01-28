import { getTranslatedSpeciesName } from "../lib/getTranslatedSpeciesName.ts";
import type { Species } from "../gql/graphql.ts";

interface Props {
  species: Species;
  speciesColors: Record<string, string>;
  isSelected?: boolean;
  onClickSpecies: (id: string) => void;
  disabled: boolean;
}

const SpeciesItem = ({
  species,
  speciesColors,
  isSelected,
  onClickSpecies,
  disabled,
}: Props) => {
  const borderRightColor = speciesColors[species.id] || "transparent";

  return (
    <div
      className={`${isSelected ? "bg-primary-darker text-white" : "bg-light"} ${disabled ? "cursor-not-allowed opacity-30" : ""}`}
    >
      <button
        type="button"
        className={`flex items-start gap-4 text-left cursor-pointer pr-4 w-full ${
          isSelected ? "bg-primary-darker" : ""
        }`}
        onClick={() => {
          if (!disabled) onClickSpecies(species.id);
        }}
      >
        <div
          className={`${isSelected ? `border-r-3` : ""} min-w-0 shrink-0`}
          style={isSelected ? { borderRightColor } : {}}
        >
          {species.imageUrl && (
            <img
              src={species.imageUrl}
              alt=""
              className="size-16 object-cover aspect-square"
            />
          )}
        </div>
        <div className="mt-2 flex-1">
          <div className="font-medium">{getTranslatedSpeciesName(species)}</div>
        </div>
      </button>
    </div>
  );
};

export default SpeciesItem;
