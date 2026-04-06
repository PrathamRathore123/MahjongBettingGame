import type { HonorValueMap } from "./honor-values";
import type { BetDirection, Hand, RoundHistoryEntry, RoundOutcome } from "./hand";
import type { Tile } from "./tile";

export const MAX_RESHUFFLES = 3;

export type GameStatus = "idle" | "playing" | "ended";
export type GameOverReason = "honor-floor" | "honor-ceiling" | "reshuffle-limit";

export type DeckState = {
  drawPile: Tile[];
  discardPile: Tile[];
  reshuffleCount: number;
};

export type GameSessionState = DeckState & {
  status: GameStatus;
  score: number;
  currentHand: Hand | null;
  pendingBet: BetDirection | null;
  history: RoundHistoryEntry[];
  honorValues: HonorValueMap;
  gameOverReason: GameOverReason | null;
};

export type ResolvedRound = {
  bet: BetDirection;
  previousHand: Hand;
  nextHand: Hand;
  outcome: RoundOutcome;
  score: number;
  drawPile: Tile[];
  discardPile: Tile[];
  reshuffleCount: number;
  honorValues: HonorValueMap;
  gameOverReason: GameOverReason | null;
};

export type GameSessionAction =
  | { type: "game/started"; payload: Omit<GameSessionState, "status"> }
  | { type: "game/bet-placed"; payload: BetDirection }
  | { type: "game/round-resolved"; payload: ResolvedRound }
  | { type: "game/exited" };
