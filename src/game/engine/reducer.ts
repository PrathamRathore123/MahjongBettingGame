import { createInitialHonorValues } from "../models";
import type { GameSessionAction, GameSessionState } from "../models";
import { applyResolvedRound, queueBet } from "./session";

export const createIdleSessionState = (): GameSessionState => ({
  status: "idle",
  score: 0,
  currentHand: null,
  pendingBet: null,
  history: [],
  honorValues: createInitialHonorValues(),
  gameOverReason: null,
  drawPile: [],
  discardPile: [],
  reshuffleCount: 0,
});

export const gameSessionReducer = (
  state: GameSessionState,
  action: GameSessionAction,
): GameSessionState => {
  switch (action.type) {
    case "game/started": {
      return {
        ...action.payload,
        status: "playing",
      };
    }

    case "game/bet-placed": {
      if (state.status !== "playing" || !state.currentHand || state.pendingBet) {
        return state;
      }

      return queueBet(state, action.payload);
    }

    case "game/round-resolved": {
      if (state.status !== "playing" || !state.pendingBet) {
        return state;
      }

      return applyResolvedRound(state, action.payload);
    }

    case "game/exited": {
      return createIdleSessionState();
    }

    default: {
      return state;
    }
  }
};
