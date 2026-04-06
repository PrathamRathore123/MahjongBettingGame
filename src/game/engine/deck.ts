import { DRAGON_TYPES, NUMBER_RANKS, NUMBER_SUITS, WIND_TYPES } from "../models";
import type { DeckState, Hand, Tile } from "../models";
import { createId, shuffleArray } from "../utils";

const COPIES_PER_TILE = 4;

const createNumberTile = (
  suit: (typeof NUMBER_SUITS)[number],
  rank: (typeof NUMBER_RANKS)[number],
): Tile => ({
  id: createId(`number-${suit}-${rank}`),
  kind: "number",
  suit,
  rank,
  label: `${rank} ${suit}`,
});

const createWindTile = (wind: (typeof WIND_TYPES)[number]): Tile => ({
  id: createId(`wind-${wind}`),
  kind: "wind",
  honor: wind,
  label: `${wind} wind`,
});

const createDragonTile = (dragon: (typeof DRAGON_TYPES)[number]): Tile => ({
  id: createId(`dragon-${dragon}`),
  kind: "dragon",
  honor: dragon,
  label: `${dragon} dragon`,
});

export const createFreshDeck = (): Tile[] => {
  const deck: Tile[] = [];

  NUMBER_SUITS.forEach((suit) => {
    NUMBER_RANKS.forEach((rank) => {
      for (let copy = 0; copy < COPIES_PER_TILE; copy += 1) {
        deck.push(createNumberTile(suit, rank));
      }
    });
  });

  WIND_TYPES.forEach((wind) => {
    for (let copy = 0; copy < COPIES_PER_TILE; copy += 1) {
      deck.push(createWindTile(wind));
    }
  });

  DRAGON_TYPES.forEach((dragon) => {
    for (let copy = 0; copy < COPIES_PER_TILE; copy += 1) {
      deck.push(createDragonTile(dragon));
    }
  });

  return deck;
};

export const createShuffledDeck = (): Tile[] => shuffleArray(createFreshDeck());

export type DrawResult = Pick<DeckState, "drawPile" | "discardPile" | "reshuffleCount"> & {
  tiles: Tile[];
};

type DrawContext = Pick<DeckState, "drawPile" | "discardPile" | "reshuffleCount">;

const reshuffleDeck = (discardPile: Tile[]) => shuffleArray([...createFreshDeck(), ...discardPile]);

export const drawTiles = (context: DrawContext, count: number): DrawResult => {
  if (count <= 0) {
    return {
      tiles: [],
      drawPile: [...context.drawPile],
      discardPile: [...context.discardPile],
      reshuffleCount: context.reshuffleCount,
    };
  }

  let drawPile = [...context.drawPile];
  let discardPile = [...context.discardPile];
  let reshuffleCount = context.reshuffleCount;

  if (drawPile.length < count) {
    discardPile = [...discardPile, ...drawPile];
    drawPile = reshuffleDeck(discardPile);
    discardPile = [];
    reshuffleCount += 1;
  }

  if (drawPile.length < count) {
    throw new Error("Deck draw failed: not enough tiles after reshuffle.");
  }

  const tiles: Tile[] = [];
  for (let index = 0; index < count; index += 1) {
    const nextTile = drawPile.pop();
    if (nextTile) {
      tiles.push(nextTile);
    }
  }

  return {
    tiles,
    drawPile,
    discardPile,
    reshuffleCount,
  };
};

export const discardHand = (discardPile: Tile[], hand: Hand): Tile[] => [...discardPile, ...hand.tiles];
