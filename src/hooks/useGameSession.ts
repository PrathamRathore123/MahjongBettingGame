import { useEffect, useReducer, useRef } from "react";
import { createGameSession, createIdleSessionState, gameSessionReducer, resolveRound } from "../game/engine";
import type { BetDirection, GameSessionState } from "../game/models";

type UseGameSession = {
  session: GameSessionState;
  startGame: () => void;
  placeBet: (bet: BetDirection) => void;
  exitGame: () => void;
};

export const useGameSession = (): UseGameSession => {
  const [session, dispatch] = useReducer(gameSessionReducer, undefined, createIdleSessionState);
  const sessionRef = useRef(session);
  const roundTimerRef = useRef<number | null>(null);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    return () => {
      if (roundTimerRef.current) {
        window.clearTimeout(roundTimerRef.current);
      }
    };
  }, []);

  const startGame = () => {
    if (roundTimerRef.current) {
      window.clearTimeout(roundTimerRef.current);
      roundTimerRef.current = null;
    }

    const started = createGameSession();
    const { status: _status, ...payload } = started;
    dispatch({ type: "game/started", payload });
  };

  const placeBet = (bet: BetDirection) => {
    const current = sessionRef.current;
    if (current.status !== "playing" || !current.currentHand || current.pendingBet) {
      return;
    }

    if (roundTimerRef.current) {
      window.clearTimeout(roundTimerRef.current);
      roundTimerRef.current = null;
    }

    dispatch({ type: "game/bet-placed", payload: bet });

    roundTimerRef.current = window.setTimeout(() => {
      const snapshot = sessionRef.current;
      if (
        snapshot.status !== "playing" ||
        !snapshot.currentHand ||
        snapshot.pendingBet !== bet
      ) {
        roundTimerRef.current = null;
        return;
      }

      const resolved = resolveRound(snapshot, bet);
      dispatch({ type: "game/round-resolved", payload: resolved });
      roundTimerRef.current = null;
    }, 380);
  };

  const exitGame = () => {
    if (roundTimerRef.current) {
      window.clearTimeout(roundTimerRef.current);
      roundTimerRef.current = null;
    }

    dispatch({ type: "game/exited" });
  };

  return {
    session,
    startGame,
    placeBet,
    exitGame,
  };
};
