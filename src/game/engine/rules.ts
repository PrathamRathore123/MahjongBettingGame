import type { BetDirection, RoundOutcome } from "../models";

export type HandComparison = "current" | "next" | "tie";

export const compareHandTotals = (currentTotal: number, nextTotal: number): HandComparison => {
  if (nextTotal > currentTotal) {
    return "next";
  }

  if (nextTotal < currentTotal) {
    return "current";
  }

  return "tie";
};

export const resolveRoundOutcome = (
  bet: BetDirection,
  currentTotal: number,
  nextTotal: number,
): RoundOutcome => {
  if (bet === "higher") {
    return nextTotal > currentTotal ? "win" : "loss";
  }

  return nextTotal < currentTotal ? "win" : "loss";
};
