import type { Tile } from "../game/models";

type TileFaceProps = {
  tile: Tile;
  value: number;
  compact?: boolean;
  showValue?: boolean;
  animateIndex?: number;
};

const numberCodepoints = {
  characters: [0x1f007, 0x1f008, 0x1f009, 0x1f00a, 0x1f00b, 0x1f00c, 0x1f00d, 0x1f00e, 0x1f00f],
  bamboo: [0x1f010, 0x1f011, 0x1f012, 0x1f013, 0x1f014, 0x1f015, 0x1f016, 0x1f017, 0x1f018],
  dots: [0x1f019, 0x1f01a, 0x1f01b, 0x1f01c, 0x1f01d, 0x1f01e, 0x1f01f, 0x1f020, 0x1f021],
} as const;

const windCodepoints = {
  east: 0x1f000,
  south: 0x1f001,
  west: 0x1f002,
  north: 0x1f003,
} as const;

const dragonCodepoints = {
  red: 0x1f004,
  green: 0x1f005,
  white: 0x1f006,
} as const;

const suitLabelMap = {
  characters: "characters",
  bamboo: "bamboo",
  dots: "dots",
} as const;

const windLabelMap = {
  east: "east wind",
  south: "south wind",
  west: "west wind",
  north: "north wind",
} as const;

const dragonLabelMap = {
  red: "red dragon",
  green: "green dragon",
  white: "white dragon",
} as const;

const toGlyph = (codepoint: number) => String.fromCodePoint(codepoint);

function TileFace({ tile, compact = false, animateIndex }: TileFaceProps) {
  const suitTone =
    tile.kind === "number"
      ? tile.suit === "characters"
        ? "text-[#a61a16]"
        : tile.suit === "dots"
          ? "text-[#1f4f2f]"
          : "text-[#1f6a3f]"
      : tile.kind === "dragon"
        ? tile.honor === "red"
          ? "text-[#b30f0a]"
          : tile.honor === "green"
            ? "text-[#1f6a3f]"
            : "text-[#47595b]"
        : "text-[#1b5f2d]";

  const glyph =
    tile.kind === "number"
      ? toGlyph(numberCodepoints[tile.suit][tile.rank - 1])
      : tile.kind === "wind"
        ? toGlyph(windCodepoints[tile.honor])
        : toGlyph(dragonCodepoints[tile.honor]);

  const subtitle =
    tile.kind === "number"
      ? `${tile.rank} ${suitLabelMap[tile.suit]}`
      : tile.kind === "wind"
        ? windLabelMap[tile.honor]
        : dragonLabelMap[tile.honor];

  const tileSize = compact
    ? "h-[48px] w-[36px] rounded-[10px] sm:h-[52px] sm:w-[38px]"
    : "h-[108px] w-[78px] rounded-[12px] sm:h-[132px] sm:w-[96px] md:h-[150px] md:w-[110px] md:rounded-[16px]";
  const glyphSize = compact
    ? "text-[28px] leading-none sm:text-[32px]"
    : "text-[70px] leading-[0.8] sm:text-[86px] md:text-[98px]";
  const labelClass = compact ? "hidden" : "hidden text-[11px] sm:block md:text-[12px]";
  const slideDelay = typeof animateIndex === "number" ? `${animateIndex * 70}ms` : "0ms";

  return (
    <article
      className={[
        "group relative flex shrink-0 flex-col items-center justify-between ",
        "bg-gradient-to-b from-[#fbf6e6] via-[#f5f0dc] to-[#eee4c7]",
        tileSize,
        "px-1.5 pb-1.5 pt-1 shadow-[0_12px_20px_rgba(0,0,0,0.45)] transition-all duration-200 ease-out sm:px-2 sm:pb-2 sm:pt-1.5",
        compact ? "" : "hover:-translate-y-1",
      ].join(" ")}
      style={{ animation: "draw-in 360ms ease both", animationDelay: slideDelay }}
    >
      <span className="pointer-events-none absolute inset-x-[7px] -bottom-[10px] h-[12px] rounded-b-[12px] bg-[#1f6f46]/70 blur-[1px]" />
      
      <span className={`${glyphSize} ${suitTone} mt-0.5 drop-shadow-[0_3px_2px_rgba(0,0,0,0.25)]`} aria-label={tile.label}>
        {glyph}
      </span>
      <span className={`${labelClass}  capitalize tracking-wide text-[#5b4f2d] text-[15px] opacity-90`}>{subtitle}</span>
    </article>
  );
}

export default TileFace;
