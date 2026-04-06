import { useEffect, useRef, useState } from "react";

type NumberSuit = "circle" | "bamboo";
type DragonSymbol = "中" | "發" | "白";

type TileFace =
  | {
      kind: "number";
      value: number;
      suit: NumberSuit;
    }
  | {
      kind: "dragon";
      symbol: DragonSymbol;
    };

type FallingTile = {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  drift: number;
  rotate: number;
  glow: boolean;
  face: TileFace;
};

const MAX_ACTIVE_TILES = 11;
const SPAWN_INTERVAL_MS = 700;
const GRID_INDEXES = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;
const PIP_PATTERNS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
  7: [0, 2, 3, 4, 5, 6, 8],
  8: [0, 1, 2, 3, 5, 6, 7, 8],
  9: [0, 1, 2, 3, 4, 5, 6, 7, 8],
};

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createFace(): TileFace {
  if (Math.random() < 0.72) {
    return {
      kind: "number",
      value: Math.floor(randomBetween(1, 10)),
      suit: Math.random() < 0.52 ? "circle" : "bamboo",
    };
  }

  const dragons: DragonSymbol[] = ["中", "發", "白"];
  return {
    kind: "dragon",
    symbol: dragons[Math.floor(randomBetween(0, dragons.length))],
  };
}

function dragonTone(symbol: DragonSymbol): "red" | "green" | "white" {
  if (symbol === "中") return "red";
  if (symbol === "發") return "green";
  return "white";
}

function createTile(id: number): FallingTile {
  return {
    id,
    left: randomBetween(4, 96),
    size: randomBetween(18, 30),
    duration: randomBetween(6800, 10200),
    delay: randomBetween(0, 280),
    opacity: randomBetween(0.24, 0.42),
    drift: randomBetween(-22, 22),
    rotate: randomBetween(-85, 85),
    glow: Math.random() > 0.7,
    face: createFace(),
  };
}

function LandingTileRain() {
  const [tiles, setTiles] = useState<FallingTile[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      return;
    }

    const initialBurstTimers: number[] = [];
    for (let i = 0; i < 3; i += 1) {
      const timer = window.setTimeout(() => {
        setTiles((previous) => {
          if (previous.length >= MAX_ACTIVE_TILES) {
            return previous;
          }
          idRef.current += 1;
          return [...previous, createTile(idRef.current)];
        });
      }, i * 220);
      initialBurstTimers.push(timer);
    }

    const spawnTimer = window.setInterval(() => {
      setTiles((previous) => {
        if (previous.length >= MAX_ACTIVE_TILES || Math.random() > 0.86) {
          return previous;
        }
        idRef.current += 1;
        return [...previous, createTile(idRef.current)];
      });
    }, SPAWN_INTERVAL_MS);

    return () => {
      window.clearInterval(spawnTimer);
      initialBurstTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-[0] overflow-hidden" aria-hidden>
      {tiles.map((tile) => {
        const numberFace = tile.face.kind === "number" ? tile.face : null;
        const dragonFace = tile.face.kind === "dragon" ? tile.face : null;
        const activePips = numberFace ? new Set(PIP_PATTERNS[numberFace.value]) : null;
        const style = {
          left: `${tile.left}%`,
          width: `${tile.size}px`,
          height: `${Math.round(tile.size * 1.34)}px`,
          animationDuration: `${tile.duration}ms`,
          animationDelay: `${tile.delay}ms`,
          ["--tile-opacity" as string]: `${tile.opacity}`,
          ["--tile-drift" as string]: `${tile.drift}px`,
          ["--tile-rotate" as string]: `${tile.rotate}deg`,
          ["--tile-size" as string]: `${tile.size}px`,
        };

        return (
          <span
            key={tile.id}
            className={`mahjong-rain-tile${tile.glow ? " mahjong-rain-tile--glow" : ""}`}
            style={style}
            onAnimationEnd={() => {
              setTiles((previous) => previous.filter((entry) => entry.id !== tile.id));
            }}
          >
            <span className="mahjong-rain-tile__face">
              {numberFace ? (
                <>
                  <span className={`mahjong-rain-tile__corner mahjong-rain-tile__corner--${numberFace.suit}`}>
                    {numberFace.value}
                  </span>
                  <span className="mahjong-rain-tile__pip-grid">
                    {GRID_INDEXES.map((index) => (
                      <span key={`${tile.id}-${index}`} className="mahjong-rain-tile__pip-cell">
                        {activePips?.has(index) ? (
                          <span className={`mahjong-rain-tile__pip mahjong-rain-tile__pip--${numberFace.suit}`} />
                        ) : null}
                      </span>
                    ))}
                  </span>
                </>
              ) : (
                <span className={`mahjong-rain-tile__dragon mahjong-rain-tile__dragon--${dragonTone(dragonFace!.symbol)}`}>
                  {dragonFace!.symbol}
                </span>
              )}
            </span>
          </span>
        );
      })}
    </div>
  );
}

export default LandingTileRain;
