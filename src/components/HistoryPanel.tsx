import type { RoundHistoryEntry } from "../game/models";
import TileFace from "./TileFace";

type HistoryPanelProps = {
  entries: RoundHistoryEntry[];
};

function HistoryPanel({ entries }: HistoryPanelProps) {
  return (
    <section
      data-wt-target="previous-hands"
      data-tour="previous-hands"
      className="max-h-[300px] overflow-y-auto rounded-[16px] border border-[#d4af37]/45 bg-gradient-to-b from-[#133c35]/70 to-[#102f2a]/70 p-4 shadow-[inset_0_0_0_1px_rgba(248,223,155,0.06)]"
    >
      <header className="mb-3 rounded-[12px] border border-[#d4af37]/25 bg-[#0d2723]/70 px-4 py-2.5">
        <h3 className="text-[24px] font-bold tracking-[0.01em] text-[#f0dd9f]">Previous Hands</h3>
      </header>
      <div className="space-y-3">
        {entries.length === 0 ? (
          <p className="rounded-[12px] border border-[#d4af37]/20 bg-black/15 px-4 py-4 text-center text-[15px] text-[#c6d2c6]">
            No rounds yet.
          </p>
        ) : (
          entries
            .slice()
            .reverse()
            .map((entry, index) => (
              <article
                className="rounded-[14px] border border-[#d4af37]/20 bg-[#102f2a]/65 px-3 py-2.5 shadow-[0_8px_18px_rgba(0,0,0,0.22)]"
                key={entry.id}
                style={{ animation: "draw-in 250ms ease both", animationDelay: `${Math.min(index, 8) * 50}ms` }}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-semibold text-[#bfcdbf]">Previous</p>
                    <p className="text-[16px] font-bold text-[#f0d27a]">Total: {entry.previous.total}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {entry.previous.tiles.map((tile) => (
                      <TileFace
                        key={`${entry.id}-previous-${tile.id}`}
                        tile={tile}
                        value={tile.kind === "number" ? tile.rank : 5}
                        compact
                        showValue={false}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <p className="text-[13px] font-semibold text-[#bfcdbf]">Next</p>
                    <p className="text-[16px] font-bold text-[#f0d27a]">Total: {entry.next.total}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {entry.next.tiles.map((tile) => (
                      <TileFace
                        key={`${entry.id}-next-${tile.id}`}
                        tile={tile}
                        value={tile.kind === "number" ? tile.rank : 5}
                        compact
                        showValue={false}
                      />
                    ))}
                  </div>

                  <div className="mt-2 flex items-center justify-between border-t border-[#d4af37]/15 pt-2">
                    <p className="text-[14px] font-semibold text-[#aab9ad]">
                      {entry.bet === "higher" ? "Bet Higher" : "Bet Lower"}
                    </p>
                    <strong
                      className={`text-[18px] font-extrabold ${
                        entry.outcome === "win" ? "text-[#7be394]" : "text-[#f15e5e]"
                      }`}
                    >
                      {entry.outcome.toUpperCase()}
                    </strong>
                  </div>
                </div>
              </article>
            ))
        )}
      </div>
    </section>
  );
}

export default HistoryPanel;
