import type { Tile } from "./tile";

export const HAND_SIZE = 3;

export type HandTiles = [Tile, Tile, Tile];
export type BetDirection = "higher" | "lower";
export type RoundOutcome = "win" | "loss";

export type Hand = {
  id: string;
  tiles: HandTiles;
  total: number;
};

export type RoundHistoryEntry = {
  id: string;
  bet: BetDirection;
  previous: Hand;
  next: Hand;
  outcome: RoundOutcome;
  scoreAfterRound: number;
};
