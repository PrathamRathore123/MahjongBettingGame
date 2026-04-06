import { getTileValue } from "../game/engine";
import type { Hand, HonorValueMap } from "../game/models";
import TileFace from "./TileFace";

type HandViewProps = {
  title: string;
  hand: Hand;
  honorValues: HonorValueMap;
};

function HandView({ title, hand, honorValues }: HandViewProps) {
  return (
    <section>
      <div className="mb-5 flex flex-col gap-3 sm:mb-7 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="pt-1 text-[clamp(1.9rem,5vw,2.875rem)] font-bold leading-none tracking-[0.01em] text-[#f1dd9e]">{title}</h2>
        <p data-wt-target="hand-total" data-tour="hand-total" className="pt-0.5 text-left font-semibold text-[#f0d27a] sm:text-right">
          <span className="mr-2 text-[26px] align-middle sm:text-[34px]">Total</span>
          <span className="text-[48px] font-extrabold leading-none sm:text-[68px]">{hand.total}</span>
        </p>
      </div>
      <div data-wt-target="special-tiles" data-tour="special-tiles" className="mb-6 flex flex-wrap justify-center gap-3 sm:mb-9 sm:gap-5">
        {hand.tiles.map((tile, index) => (
          <TileFace
            key={tile.id}
            tile={tile}
            value={getTileValue(tile, honorValues)}
            animateIndex={index}
          />
        ))}
      </div>
    </section>
  );
}

export default HandView;
