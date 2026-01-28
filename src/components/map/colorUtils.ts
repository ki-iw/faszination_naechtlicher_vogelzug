export const buildColorExpression = (
  speciesList: string[],
  speciesColors: Record<string, string>,
) => {
  if (speciesList.length === 0) return "#cccccc";
  const cases: string[] = [];

  Object.entries(speciesColors).forEach(([id, color]) => {
    cases.push(id);
    cases.push(color);
  });

  if (cases.length === 0) return "#ccc";

  return ["match", ["get", "species"], ...cases, "#cccccc"];
};
