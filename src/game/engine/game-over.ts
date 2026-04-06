import { ALL_HONOR_TYPES, HONOR_MAX_VALUE, HONOR_MIN_VALUE, MAX_RESHUFFLES } from "../models";
import type { GameOverReason, HonorValueMap } from "../models";

export const getGameOverReason = (
  honorValues: HonorValueMap,
  reshuffleCount: number,
): GameOverReason | null => {
  const hasFloorHit = ALL_HONOR_TYPES.some((honor) => honorValues[honor] <= HONOR_MIN_VALUE);
  if (hasFloorHit) {
    return "honor-floor";
  }

  const hasCeilingHit = ALL_HONOR_TYPES.some((honor) => honorValues[honor] >= HONOR_MAX_VALUE);
  if (hasCeilingHit) {
    return "honor-ceiling";
  }

  if (reshuffleCount >= MAX_RESHUFFLES) {
    return "reshuffle-limit";
  }

  return null;
};

export const isGameOver = (honorValues: HonorValueMap, reshuffleCount: number): boolean =>
  getGameOverReason(honorValues, reshuffleCount) !== null;
