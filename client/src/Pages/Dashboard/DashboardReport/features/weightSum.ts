import type { DimensionWeights } from "src/shared/types/report";

export const weightSum = (w: DimensionWeights | undefined): number => {
  if (!w) return 0;
  return (
    (w.Reliability ?? 0) +
    (w.Integrity ?? 0) +
    (w.Judgment ?? 0) +
    (w.Resistance ?? 0) +
    (w.Resilience ?? 0)
  );
};
