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
      <div className="mb-7 flex items-start justify-between">
        <h2 className="pt-4 text-[46px] font-bold leading-none tracking-[0.01em] text-[#f1dd9e]">{title}</h2>
        <p data-wt-target="hand-total" data-tour="hand-total" className="pt-0.5 text-right font-semibold text-[#f0d27a]">
          <span className="mr-2 text-[34px] align-middle">Total</span>
          <span className="text-[68px] font-extrabold leading-none">{hand.total}</span>
        </p>
      </div>
      <div data-wt-target="special-tiles" data-tour="special-tiles" className="mb-9 flex justify-center gap-5">
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
