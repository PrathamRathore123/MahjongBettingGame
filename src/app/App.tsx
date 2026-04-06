import { useEffect, useMemo, useRef, useState } from "react";
import { EndGameScreen, GameScreen, LandingPage } from "../components";
import LandingTileRain from "../components/LandingTileRain";
import { useBoardWalkthrough, useGameSession } from "../hooks";
import { MAX_RESHUFFLES } from "../game/models";
import type { GameOverReason, LeaderboardEntry, RoundOutcome } from "../game/models";
import { addLeaderboardScore, getLeaderboard } from "../services";

type ViewMode = "landing" | "session";

const gameOverReasonText: Record<GameOverReason, string> = {
  "honor-floor": "An honor tile reached 0 value.",
  "honor-ceiling": "An honor tile reached 10 value.",
  "reshuffle-limit": "The draw pile reshuffled 3 times.",
};
const START_GAME_AUDIO_SRC = "/universfield-computer-mouse-click-352734.mp3";
const GAME_SCREEN_MUSIC_SRC = "/02.%20Qui.mp3";

const getNextDefaultPlayerName = (entries: LeaderboardEntry[]): string => {
  const highestPlayerIndex = entries.reduce((highest, entry) => {
    const normalizedName = entry.name.trim();
    const numberedMatch = /^player\s*(\d+)$/i.exec(normalizedName);
    if (numberedMatch) {
      const playerIndex = Number(numberedMatch[1]);
      if (!Number.isFinite(playerIndex)) {
        return highest;
      }

      return playerIndex > highest ? playerIndex : highest;
    }

    // Backward compatibility: older entries may use plain "Player" with no index.
    if (/^player$/i.test(normalizedName)) {
      return highest < 1 ? 1 : highest;
    }

    return highest;
  }, 0);

  return `Player ${highestPlayerIndex + 1}`;
};

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("landing");
  const [leaderboard, setLeaderboard] = useState(getLeaderboard);
  const [playerName, setPlayerName] = useState(() => getNextDefaultPlayerName(getLeaderboard()));
  const [roundFeedback, setRoundFeedback] = useState<RoundOutcome | null>(null);
  const startGameAudioRef = useRef<HTMLAudioElement | null>(null);
  const gameScreenMusicRef = useRef<HTMLAudioElement | null>(null);
  const hasSavedEndScoreRef = useRef(false);
  const previousHistoryLengthRef = useRef(0);
  const hasAutoStartedWalkthroughRef = useRef(false);
  const forceWalkthroughOnStartRef = useRef(false);
  const { session, startGame, placeBet, exitGame } = useGameSession();
  const walkthrough = useBoardWalkthrough();
  const {
    isOpen: walkthroughOpen,
    currentStep: walkthroughStep,
    stepIndex: walkthroughStepIndex,
    totalSteps: walkthroughTotalSteps,
    shouldAutoRun: shouldAutoRunWalkthrough,
    start: startWalkthrough,
    skip: skipWalkthrough,
    next: nextWalkthroughStep,
  } = walkthrough;

  useEffect(() => {
    const audio = new Audio(START_GAME_AUDIO_SRC);
    audio.preload = "auto";
    audio.volume = 0.85;
    startGameAudioRef.current = audio;

    return () => {
      audio.pause();
      startGameAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = new Audio(GAME_SCREEN_MUSIC_SRC);
    audio.preload = "auto";
    audio.loop = true;
    audio.volume = 0.42;
    gameScreenMusicRef.current = audio;

    return () => {
      audio.pause();
      gameScreenMusicRef.current = null;
    };
  }, []);

  const playStartGameAudio = () => {
    const audio = startGameAudioRef.current;
    if (!audio) {
      return;
    }

    audio.currentTime = 0;
    void audio.play().catch(() => {});
  };

  const playGameScreenMusic = () => {
    const audio = gameScreenMusicRef.current;
    if (!audio) {
      return;
    }

    if (!audio.paused) {
      return;
    }

    void audio.play().catch(() => {});
  };

  const stopGameScreenMusic = (resetTime = false) => {
    const audio = gameScreenMusicRef.current;
    if (!audio) {
      return;
    }

    audio.pause();
    if (resetTime) {
      audio.currentTime = 0;
    }
  };

  useEffect(() => {
    if (viewMode === "session") {
      playGameScreenMusic();
      return;
    }

    stopGameScreenMusic(true);
  }, [viewMode]);

  useEffect(() => {
    if (session.status === "ended" && !hasSavedEndScoreRef.current) {
      const updatedLeaderboard = addLeaderboardScore(session.score, playerName);
      setLeaderboard(updatedLeaderboard);
      setPlayerName(getNextDefaultPlayerName(updatedLeaderboard));
      hasSavedEndScoreRef.current = true;
    }
  }, [playerName, session.score, session.status]);

  useEffect(() => {
    if (session.status !== "playing") {
      return;
    }

    if (session.history.length > previousHistoryLengthRef.current) {
      const latestOutcome = session.history[session.history.length - 1]?.outcome ?? null;
      setRoundFeedback(latestOutcome);

      const timer = window.setTimeout(() => {
        setRoundFeedback(null);
      }, 460);

      previousHistoryLengthRef.current = session.history.length;
      return () => window.clearTimeout(timer);
    }

    previousHistoryLengthRef.current = session.history.length;
    return;
  }, [session.history, session.status]);

  const gameOverMessage = useMemo(() => {
    if (!session.gameOverReason) {
      return "The session ended.";
    }

    return gameOverReasonText[session.gameOverReason];
  }, [session.gameOverReason]);

  const handleStartGame = () => {
    const latestLeaderboard = getLeaderboard();
    setLeaderboard(latestLeaderboard);
    setPlayerName(getNextDefaultPlayerName(latestLeaderboard));
    playStartGameAudio();
    playGameScreenMusic();
    hasSavedEndScoreRef.current = false;
    previousHistoryLengthRef.current = 0;
    hasAutoStartedWalkthroughRef.current = false;
    setRoundFeedback(null);
    startGame();
    setViewMode("session");
  };

  const handleHowToPlayFromLanding = () => {
    forceWalkthroughOnStartRef.current = true;
    handleStartGame();
  };

  const handleExitToLanding = () => {
    playStartGameAudio();
    stopGameScreenMusic(true);
    exitGame();
    setViewMode("landing");
    setRoundFeedback(null);
    const latestLeaderboard = getLeaderboard();
    setLeaderboard(latestLeaderboard);
    setPlayerName(getNextDefaultPlayerName(latestLeaderboard));
  };

  const isSessionVisible = viewMode === "session" && Boolean(session.currentHand);

  useEffect(() => {
    if (viewMode !== "session" || session.status !== "playing" || !session.currentHand) {
      return;
    }

    if (forceWalkthroughOnStartRef.current) {
      startWalkthrough();
      hasAutoStartedWalkthroughRef.current = true;
      forceWalkthroughOnStartRef.current = false;
      return;
    }

    if (!shouldAutoRunWalkthrough || hasAutoStartedWalkthroughRef.current) {
      return;
    }

    startWalkthrough();
    hasAutoStartedWalkthroughRef.current = true;
  }, [session.currentHand, session.status, shouldAutoRunWalkthrough, startWalkthrough, viewMode]);

  return (
    <main className="min-h-screen">
      {viewMode === "landing" ? (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#0f2f2a] via-[#123d35] to-[#0b2622] px-4 py-6">
          <LandingTileRain />
          <div className="relative z-[1]">
            <LandingPage
              leaderboard={leaderboard}
              onNewGame={handleStartGame}
              onHowToPlay={handleHowToPlayFromLanding}
            />
          </div>
        </div>
      ) : null}

      {isSessionVisible && session.currentHand ? (
        <GameScreen
          currentHand={session.currentHand}
          honorValues={session.honorValues}
          history={session.history}
          score={session.score}
          drawPileCount={session.drawPile.length}
          discardPileCount={session.discardPile.length}
          reshuffleCount={session.reshuffleCount}
          maxReshuffles={MAX_RESHUFFLES}
          roundFeedback={roundFeedback}
          playerName={playerName}
          onBet={placeBet}
          onPlayerNameChange={setPlayerName}
          onExit={handleExitToLanding}
          onNewGame={handleStartGame}
          walkthroughOpen={walkthroughOpen}
          walkthroughStep={walkthroughStep}
          walkthroughStepIndex={walkthroughStepIndex}
          walkthroughTotalSteps={walkthroughTotalSteps}
          onWalkthroughNext={nextWalkthroughStep}
          onWalkthroughSkip={skipWalkthrough}
          onReplayWalkthrough={startWalkthrough}
          isResolvingRound={session.pendingBet !== null}
          disabled={session.status === "ended" || session.pendingBet !== null}
        />
      ) : null}

      {viewMode === "session" && session.status === "ended" ? (
        <EndGameScreen
          finalScore={session.score}
          reason={gameOverMessage}
          onRestart={handleStartGame}
          onExit={handleExitToLanding}
        />
      ) : null}

      {viewMode === "session" && session.status === "idle" ? (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0f2f2a] via-[#123d35] to-[#0b2622] px-4">
          <div className="rounded-[16px] border border-[#d4af37]/45 bg-[#113430]/80 p-6 text-center text-[#f0ddb0]">
            <p className="text-[18px]">Session is idle.</p>
            <button
              onClick={handleStartGame}
              className="mt-3 h-[48px] rounded-[12px] border border-[#d4af37]/65 bg-[#0f2d29] px-4 text-[16px] font-semibold"
            >
              Start Game
            </button>
          </div>
        </div>
      ) : null}

      {viewMode === "session" && session.status === "playing" && !session.currentHand ? (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0f2f2a] via-[#123d35] to-[#0b2622] px-4">
          <div className="rounded-[16px] border border-[#d4af37]/45 bg-[#113430]/80 p-6 text-center text-[#f0ddb0]">
            <p className="text-[18px]">Could not load a hand.</p>
            <button
              onClick={handleStartGame}
              className="mt-3 h-[48px] rounded-[12px] border border-[#d4af37]/65 bg-[#0f2d29] px-4 text-[16px] font-semibold"
            >
              Restart
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default App;
