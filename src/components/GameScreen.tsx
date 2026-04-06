import type {
  BetDirection,
  Hand,
  HonorValueMap,
  RoundHistoryEntry,
} from "../game/models";
import type { BoardWalkthroughStep } from "../data/boardWalkthroughSteps";
import HandView from "./HandView";
import HistoryPanel from "./HistoryPanel";
import LandingTileRain from "./LandingTileRain";
import BoardWalkthrough from "./tutorial/BoardWalkthrough";

type GameScreenProps = {
  currentHand: Hand;
  honorValues: HonorValueMap;
  history: RoundHistoryEntry[];
  score: number;
  drawPileCount: number;
  discardPileCount: number;
  reshuffleCount: number;
  maxReshuffles: number;
  roundFeedback: "win" | "loss" | null;
  playerName: string;
  onBet: (direction: BetDirection) => void;
  onPlayerNameChange: (value: string) => void;
  onExit: () => void;
  onNewGame: () => void;
  walkthroughOpen: boolean;
  walkthroughStep: BoardWalkthroughStep;
  walkthroughStepIndex: number;
  walkthroughTotalSteps: number;
  onWalkthroughNext: () => void;
  onWalkthroughSkip: () => void;
  onReplayWalkthrough: () => void;
  isResolvingRound?: boolean;
  disabled?: boolean;
};

function GameScreen({
  currentHand,
  honorValues,
  history,
  score,
  drawPileCount,
  discardPileCount,
  reshuffleCount,
  maxReshuffles,
  roundFeedback,
  playerName,
  onBet,
  onPlayerNameChange,
  onExit,
  onNewGame,
  walkthroughOpen,
  walkthroughStep,
  walkthroughStepIndex,
  walkthroughTotalSteps,
  onWalkthroughNext,
  onWalkthroughSkip,
  onReplayWalkthrough,
  isResolvingRound = false,
  disabled = false,
}: GameScreenProps) {
  const stats = [
    { label: "Score", value: score },
    { label: "Draw Pile", value: drawPileCount },
    { label: "Discard Pile", value: discardPileCount },
    { label: "Reshuffle", value: `${reshuffleCount}/${maxReshuffles}` },
  ];

  return (
    <div className="relative min-h-screen w-full   overflow-hidden bg-gradient-to-b from-[#0f2f2a] via-[#123d35] to-[#0b2622] px-6 py-6  text-[#f3e3b2]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_14%,rgba(255,255,255,0.08),transparent_42%),radial-gradient(circle_at_86%_10%,rgba(212,175,55,0.08),transparent_34%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 6px), repeating-linear-gradient(90deg, rgba(255,255,255,0.022) 0 1px, transparent 1px 7px)",
        }}
      />
      <LandingTileRain />

      <div className="relative z-[1] mx-auto  w-full max-w-[1200px]">
        <div className="relative min-h-[690px] rounded-[20px] bg-gradient-to-b from-[#123d35]/90 via-[#0e322d]/90 to-[#0d2925]/95 p-[18px] shadow-[0_0_0_1px_rgba(248,223,155,0.08)_inset,0_28px_64px_rgba(0,0,0,0.5)]">
          <img
            src="/pngwing.com.png"
            alt=""
            aria-hidden 
            className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-fill opacity-70"
          />

          <div className="relative z-[2]">
          <header className="h-[78px] rounded-[16px] border border-[#d4af37]/45 bg-[#0e2b27]/75 px-[14px]">
            <div className="flex h-full items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  className="h-[44px] rounded-[12px] border border-[#d4af37]/55 bg-[#0f2d29] px-4 text-[14px] font-semibold text-[#f1dea3] shadow-[0_10px_18px_rgba(0,0,0,0.3)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(212,175,55,0.35)]"
                  onClick={onExit}
                  disabled={walkthroughOpen || disabled}
                >
                  Exit
                </button>
                <input
                  type="text"
                  value={playerName}
                  onChange={(event) => onPlayerNameChange(event.target.value)}
                  placeholder="Player Name"
                  maxLength={24}
                  disabled={walkthroughOpen || disabled}
                  className="h-[44px] w-[190px] rounded-[12px] border border-[#d4af37]/45 bg-[#0f2d29]/95 px-3 text-[14px] font-medium text-[#f1dea3] outline-none shadow-[0_10px_18px_rgba(0,0,0,0.28)] transition-all duration-200 placeholder:text-[#c4cfbe] focus:border-[#d4af37]/75 focus:shadow-[0_0_16px_rgba(212,175,55,0.22)] disabled:opacity-60"
                />
              </div>

              <div className="flex items-center gap-1.5 pr-1">
                <button
                  className="grid h-[36px] w-[36px] place-items-center rounded-full border border-[#d4af37]/55 bg-[#0f2d29] text-[15px] font-bold text-[#f0dd9f] shadow-[0_10px_18px_rgba(0,0,0,0.3)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_18px_rgba(212,175,55,0.35)]"
                  onClick={onReplayWalkthrough}
                  aria-label="How to Play"
                  disabled={disabled}
                >
                  ?
                </button>
                <div data-wt-target="top-stats" data-tour="top-stats" className="flex items-center gap-2">
                {stats.map((stat) => (
                  <article
                    key={stat.label}
                    className="flex h-[58px] w-[120px] flex-col justify-center items-center rounded-[14px] border border-[#d4af37]/40 bg-white/5 px-3 shadow-[0_6px_14px_rgba(0,0,0,0.28)]"
                  >
                    <span className="text-[12px] uppercase tracking-[0.06em] text-[#c6cfbf]">{stat.label}</span>
                    <strong className="mt-1 text-[30px] font-bold leading-none text-[#f1d58a]">{stat.value}</strong>
                  </article>
                ))}
                </div>
              </div>
            </div>
          </header>

          <section className="mt-[14px] grid min-h-[540px] grid-cols-[7fr_3fr] gap-[14px] max-[1120px]:grid-cols-1">
            <div
              className={[
                "relative rounded-[20px] border border-[#d4af37]/65 bg-gradient-to-b from-[#15463f]/70 via-[#123a34]/70 to-[#102f2a]/80 px-[18px] pb-[18px] pt-[14px] shadow-[inset_0_0_0_1px_rgba(248,223,155,0.08)]",
                roundFeedback === "loss" ? "animate-[board-shake_280ms_ease]" : "",
              ].join(" ")}
              data-wt-target="current-hand"
              data-tour="current-hand"
            >
            

              <HandView title="Current Hand" hand={currentHand} honorValues={honorValues} />

              <div className="mt-3 border-t border-[#d4af37]/35 pt-3.5">
                <div
                  data-wt-target="bet-controls"
                  data-tour="bet-controls"
                  className="flex items-center justify-between gap-4"
                >
                  <button
                    className="h-[56px] w-[48%] rounded-[16px] border border-[#89c79f]/45 bg-gradient-to-r from-[#3bb78f] to-[#0bab64] text-[17px] font-bold text-white shadow-[0_12px_22px_rgba(0,0,0,0.38)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_22px_rgba(59,183,143,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => onBet("higher")}
                    disabled={disabled || walkthroughOpen}
                  >
                    Bet Higher
                  </button>
                  <button
                    className="h-[56px] w-[48%] rounded-[16px] border border-[#e08f7f]/45 bg-gradient-to-r from-[#e96443] to-[#904e95] text-[17px] font-bold text-white shadow-[0_12px_22px_rgba(0,0,0,0.38)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_22px_rgba(233,100,67,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => onBet("lower")}
                    disabled={disabled || walkthroughOpen}
                  >
                    Bet Lower
                  </button>
                </div>
                {isResolvingRound ? (
                  <p className="mt-3 text-center text-[13px] font-medium tracking-[0.02em] text-[#d7e2d1] animate-pulse">
                    Revealing next hand...
                  </p>
                ) : null}
              </div>
            </div>

            <aside className="relative flex rounded-[20px] border border-[#d4af37]/65 bg-gradient-to-b from-[#123a34]/70 to-[#0f2d29]/80 px-[14px] pb-[14px] pt-[12px] shadow-[inset_0_0_0_1px_rgba(248,223,155,0.06)]">
              

              <div className="flex w-full flex-col gap-4">
                <HistoryPanel entries={history} />
                <button
                  className="mt-1 h-[52px] w-full rounded-[16px] border border-[#d4af37]/75 bg-gradient-to-b from-[#e36b2c] to-[#c94c2c] text-[20px] font-bold text-[#ffe7bc] shadow-[0_14px_24px_rgba(0,0,0,0.38)] transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(227,107,44,0.45)]"
                  onClick={onNewGame}
                  disabled={walkthroughOpen || disabled}
                >
                  New Game
                </button>
              </div>
            </aside>
          </section>
          </div>
        </div>
      </div>

      {roundFeedback ? (
        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
            roundFeedback === "win" ? "bg-[#44ff88]/10" : "bg-[#ff4f4f]/10"
          }`}
        />
      ) : null}

      <BoardWalkthrough
        isOpen={walkthroughOpen}
        step={walkthroughStep}
        stepIndex={walkthroughStepIndex}
        totalSteps={walkthroughTotalSteps}
        onNext={onWalkthroughNext}
        onSkip={onWalkthroughSkip}
      />
    </div>
  );
}

export default GameScreen;
