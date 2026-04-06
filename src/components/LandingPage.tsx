import type { LeaderboardEntry } from "../game/models";

type LandingPageProps = {
  leaderboard: LeaderboardEntry[];
  onNewGame: () => void;
  onHowToPlay?: () => void;
};

function LandingPage({ leaderboard, onNewGame, onHowToPlay }: LandingPageProps) {
  void onHowToPlay;
  const topFive = leaderboard.slice(0, 5);

  return (
    <div className="relative h-[560px] w-[1080px] overflow-hidden rounded-[24px] border border-[#d4af37]/65 bg-gradient-to-b from-[#123d35] via-[#0f2f2a] to-[#0b2622] px-5 py-4 shadow-[inset_0_0_0_1px_rgba(248,223,155,0.08),0_24px_56px_rgba(0,0,0,0.45)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.09),transparent_46%),radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.24),transparent_76%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 6px), repeating-linear-gradient(90deg, rgba(255,255,255,0.022) 0 1px, transparent 1px 7px)",
        }}
      />
      <img
        src="/pngwing.com.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-fill opacity-85"
      />

      <section className="relative z-[2] mx-auto flex h-full w-full max-w-[700px] flex-col items-center justify-center">
        <h1 className="landing-title-font text-center text-[46px] font-extrabold leading-none tracking-[0.01em] text-[#d4af37] drop-shadow-[0_3px_10px_rgba(0,0,0,0.58)]">
          Hand Betting Game
        </h1>

        <div className="mt-4 flex items-end justify-center gap-1.5" aria-hidden>
          <div className="relative h-[72px] w-[54px] rotate-[-10deg] rounded-[10px] border border-[#dbc98a]/70 bg-gradient-to-b from-[#fbf6e6] via-[#f5f0dc] to-[#eee4c7] shadow-[0_10px_14px_rgba(0,0,0,0.45)]">
            <div className="grid h-full place-items-center pt-1 text-[44px] leading-none text-[#b30f0a]">{"\u4E2D"}</div>
            <span className="pointer-events-none absolute inset-x-[5px] -bottom-[7px] h-[7px] rounded-b-[8px] bg-[#2f7a4d]/75 blur-[1px]" />
          </div>
          <div className="relative h-[72px] w-[54px] rotate-[8deg] rounded-[10px] border border-[#dbc98a]/70 bg-gradient-to-b from-[#fbf6e6] via-[#f5f0dc] to-[#eee4c7] shadow-[0_10px_14px_rgba(0,0,0,0.45)]">
            <div className="grid h-full place-items-center text-[#2f6b42]">
              <div className="grid grid-cols-2 gap-x-1 gap-y-0.5 text-[9px] font-bold leading-none">
                <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-[#2f6b42] text-[#f2e9c8]">6</span>
                <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-[#2f6b42] text-[#f2e9c8]">5</span>
                <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-[#2f6b42] text-[#f2e9c8]">C</span>
                <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-[#2f6b42] text-[#f2e9c8]">5</span>
                <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-[#2f6b42] text-[#f2e9c8]">O</span>
                <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-[#2f6b42] text-[#f2e9c8]">5</span>
              </div>
            </div>
            <span className="pointer-events-none absolute inset-x-[5px] -bottom-[7px] h-[7px] rounded-b-[8px] bg-[#2f7a4d]/75 blur-[1px]" />
          </div>
        </div>
        <button
          className="cta-fire-flare mt-[27px] h-[48px] w-[292px] rounded-[13px] border border-[#d4af37]/80 bg-gradient-to-b from-[#e36b2c] to-[#c94c2c] text-[#f6e3b8] shadow-[inset_0_1px_0_rgba(255,224,163,0.46),0_10px_18px_rgba(0,0,0,0.4)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[inset_0_1px_0_rgba(255,224,163,0.58),0_0_14px_rgba(227,107,44,0.35),0_10px_18px_rgba(0,0,0,0.4)]"
          onClick={onNewGame}
        >
          <span className="relative z-[1] text-[18px] font-bold">New Game</span>
        </button>

        <section className="relative mt-[16px] w-[452px] rounded-[15px] border border-[#d4af37]/70 bg-gradient-to-b from-[#133c35]/75 to-[#102f2a]/75 px-4 pb-3 pt-2.5 shadow-[inset_0_0_0_1px_rgba(248,223,155,0.08),0_10px_20px_rgba(0,0,0,0.3)]">
          <header className="mb-2 flex items-center justify-center gap-2 text-[#d9bb66]">
            <span className="text-[13px]">{"\u{1F3C6}"}</span>
            <h2 className="text-[24px] font-bold leading-none">Leaderboard</h2>
          </header>

          <div className="overflow-hidden rounded-[10px] border border-[#d4af37]/20 bg-[#0f2d29]/55">
            {topFive.length === 0 ? (
              <div className="h-[92px] px-4 py-5 text-center text-[16px] text-[#bfccc0]">No scores yet.</div>
            ) : (
              <>
                {topFive.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex h-[26px] items-center justify-between border-b border-[#d4af37]/15 px-4 ${
                      index === topFive.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-2 text-[#e3cb82]">
                      <span className="w-7 shrink-0 text-right text-[16px] font-semibold leading-none tabular-nums">
                        {index + 1}.
                      </span>
                      <span className="truncate text-[14px] font-semibold leading-none text-[#d8e4d7]">
                        {entry.name}
                      </span>
                    </div>
                    <span className="text-[16px] font-bold leading-none text-[#e5cd84]">{entry.score}</span>
                  </div>
                ))}
                <div className="flex h-[30px] items-center justify-center gap-2 border-t border-[#d4af37]/15 text-[#e3cb82]">
                  <span className="grid h-[18px] w-[18px] place-items-center rounded-[4px] border border-[#d4af37]/50 bg-[#f1e4bc] text-[11px] font-bold text-[#233d30]">
                    ?
                  </span>
                  <span className="text-[16px] font-semibold leading-none">Top 5 Scores</span>
                </div>
              </>
            )}
          </div>
        </section>

       
      </section>
    </div>
  );
}

export default LandingPage;
