import type { LeaderboardEntry } from "../game/models";

type LeaderboardListProps = {
  entries: LeaderboardEntry[];
  title?: string;
};

function LeaderboardList({ entries, title = "Top 5 Leaderboard" }: LeaderboardListProps) {
  return (
    <section className="rounded-[16px] border border-[#d4af37]/45 bg-gradient-to-b from-[#133c35]/70 to-[#102f2a]/70 p-4 shadow-[inset_0_0_0_1px_rgba(248,223,155,0.06)]">
      <header className="mb-3 flex items-center gap-2 border-b border-[#d4af37]/30 pb-2">
        <span className="text-[26px]">{"\u{1F3C6}"}</span>
        <h2 className="text-[26px] font-bold text-[#f0dd9f]">{title}</h2>
      </header>
      <ol className="overflow-hidden rounded-[12px] border border-[#d4af37]/20 bg-[#0f2d29]/55">
        {entries.length === 0 ? (
          <li className="px-4 py-4 text-center text-[16px] text-[#bfccc0]">No scores yet. Start the first run.</li>
        ) : (
          entries.map((entry, index) => (
            <li
              key={entry.id}
              className={[
                "flex h-[40px] items-center justify-between border-b border-[#d4af37]/15 px-5 text-[16px]",
                index === entries.length - 1 ? "border-b-0" : "",
                index === 0 ? "bg-[#d4af37]/12 text-[#f7e3aa]" : "text-[#e5d79f]",
              ].join(" ")}
            >
              <span className="font-semibold">{index + 1}</span>
              <span className="text-[18px] font-bold">{entry.score}</span>
            </li>
          ))
        )}
      </ol>
    </section>
  );
}

export default LeaderboardList;
