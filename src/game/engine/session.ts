import { createInitialHonorValues } from "../models";
import type {
  BetDirection,
  GameSessionState,
  ResolvedRound,
  RoundHistoryEntry,
  RoundOutcome,
} from "../models";
import { createId } from "../utils";
import { discardHand } from "./deck";
import { createShuffledDeck } from "./deck";
import { getGameOverReason } from "./game-over";
import { drawHand } from "./hand";
import { applyRoundHonorScaling } from "./honor-scaling";
import { resolveRoundOutcome } from "./rules";

const calculateNextScore = (score: number, outcome: RoundOutcome): number =>
  outcome === "win" ? score + 1 : score;

const createHistoryEntry = (resolved: ResolvedRound): RoundHistoryEntry => ({
  id: createId("round"),
  bet: resolved.bet,
  previous: resolved.previousHand,
  next: resolved.nextHand,
  outcome: resolved.outcome,
  scoreAfterRound: resolved.score,
});

export const createGameSession = (): GameSessionState => {
  const honorValues = createInitialHonorValues();
  const initialDraw = drawHand(
    {
      drawPile: createShuffledDeck(),
      discardPile: [],
      reshuffleCount: 0,
    },
    honorValues,
  );

  return {
    status: "playing",
    score: 0,
    currentHand: initialDraw.hand,
    pendingBet: null,
    history: [],
    honorValues,
    gameOverReason: null,
    drawPile: initialDraw.drawPile,
    discardPile: initialDraw.discardPile,
    reshuffleCount: initialDraw.reshuffleCount,
  };
};

export const resolveRound = (state: GameSessionState, bet: BetDirection): ResolvedRound => {
  if (!state.currentHand) {
    throw new Error("Cannot resolve round without a current hand.");
  }

  const nextDraw = drawHand(
    {
      drawPile: state.drawPile,
      discardPile: state.discardPile,
      reshuffleCount: state.reshuffleCount,
    },
    state.honorValues,
  );

  const outcome = resolveRoundOutcome(bet, state.currentHand.total, nextDraw.hand.total);
  const score = calculateNextScore(state.score, outcome);
  const discardPile = discardHand(nextDraw.discardPile, state.currentHand);
  const honorValues = applyRoundHonorScaling(state.honorValues, state.currentHand, nextDraw.hand);
  const gameOverReason = getGameOverReason(honorValues, nextDraw.reshuffleCount);

  return {
    bet,
    previousHand: state.currentHand,
    nextHand: nextDraw.hand,
    outcome,
    score,
    drawPile: nextDraw.drawPile,
    discardPile,
    reshuffleCount: nextDraw.reshuffleCount,
    honorValues,
    gameOverReason,
  };
};

export const applyResolvedRound = (
  state: GameSessionState,
  resolved: ResolvedRound,
): GameSessionState => ({
  ...state,
  status: resolved.gameOverReason ? "ended" : "playing",
  score: resolved.score,
  currentHand: resolved.nextHand,
  pendingBet: null,
  history: [...state.history, createHistoryEntry(resolved)],
  honorValues: resolved.honorValues,
  gameOverReason: resolved.gameOverReason,
  drawPile: resolved.drawPile,
  discardPile: resolved.discardPile,
  reshuffleCount: resolved.reshuffleCount,
});

export const queueBet = (state: GameSessionState, bet: BetDirection): GameSessionState => ({
  ...state,
  pendingBet: bet,
});
