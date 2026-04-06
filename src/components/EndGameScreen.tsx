type EndGameScreenProps = {
  finalScore: number;
  reason: string;
  onRestart: () => void;
  onExit: () => void;
};

function EndGameScreen({ finalScore, reason, onRestart, onExit }: EndGameScreenProps) {
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/45 px-4 backdrop-blur-[4px]">
      <section
        className="w-full max-w-[460px] rounded-[20px] border border-[#d4af37]/70 bg-gradient-to-b from-[#153f37]/95 to-[#0f2d29]/95 p-6 text-center shadow-[0_28px_60px_rgba(0,0,0,0.55)]"
        role="dialog"
        aria-modal="true"
        aria-label="Game over"
      >
        <p className="text-[14px] font-semibold uppercase tracking-[0.16em] text-[#cfd7c6]">Game Over</p>
        <h1 className="mt-1 text-[68px] font-extrabold leading-none text-[#f4da8f]">{finalScore}</h1>
        <p className="text-[18px] font-semibold text-[#e8d7a2]">Final Score</p>
        <p className="mt-3 text-[15px] text-[#c8d5c9]">{reason}</p>
        <div className="mt-6 grid grid-cols-1 gap-3">
          <button
            onClick={onRestart}
            className="h-[52px] rounded-[14px] border border-[#8fce9f]/45 bg-gradient-to-r from-[#3bb78f] to-[#0bab64] text-[18px] font-bold text-white transition-all duration-200 hover:scale-[1.02]"
          >
            Play Again
          </button>
          <button
            className="h-[50px] rounded-[14px] border border-[#d4af37]/55 bg-[#102f2a] text-[16px] font-semibold text-[#f2dfaa] transition-all duration-200 hover:scale-[1.02]"
            onClick={onExit}
          >
            Exit to Landing
          </button>
        </div>
      </section>
    </div>
  );
}

export default EndGameScreen;
