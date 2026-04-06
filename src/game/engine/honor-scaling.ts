import { HONOR_MAX_VALUE, HONOR_MIN_VALUE } from "../models";
import type { Hand, HonorType, HonorValueMap } from "../models";
import { getHonorCounts } from "./hand";
import { compareHandTotals } from "./rules";

const clampHonorValue = (value: number): number =>
  Math.max(HONOR_MIN_VALUE, Math.min(HONOR_MAX_VALUE, value));

const applyDelta = (
  values: HonorValueMap,
  honorCounts: Record<HonorType, number>,
  delta: number,
) => {
  (Object.keys(honorCounts) as HonorType[]).forEach((honor) => {
    if (honorCounts[honor] === 0) {
      return;
    }

    values[honor] = clampHonorValue(values[honor] + delta);
  });
};

export const applyRoundHonorScaling = (
  honorValues: HonorValueMap,
  currentHand: Hand,
  nextHand: Hand,
): HonorValueMap => {
  const nextValues: HonorValueMap = { ...honorValues };
  const currentHonorCounts = getHonorCounts(currentHand.tiles);
  const nextHonorCounts = getHonorCounts(nextHand.tiles);
  const comparison = compareHandTotals(currentHand.total, nextHand.total);

  if (comparison === "next") {
    applyDelta(nextValues, nextHonorCounts, 1);
    applyDelta(nextValues, currentHonorCounts, -1);
    return nextValues;
  }

  if (comparison === "current") {
    applyDelta(nextValues, currentHonorCounts, 1);
    applyDelta(nextValues, nextHonorCounts, -1);
    return nextValues;
  }

  applyDelta(nextValues, currentHonorCounts, -1);
  applyDelta(nextValues, nextHonorCounts, -1);
  return nextValues;
};
