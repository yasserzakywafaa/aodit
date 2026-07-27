import type { DimensionWeights } from "src/shared/types/report";

export const weightSum = (w: DimensionWeights | undefined): number => {
  if (!w) return 0;

  return (
    Object.values(w).reduce(
      (sum, value) => (sum ?? 0) + (typeof value === "number" ? value : 0),
      0,
    ) || 0
  );
};
