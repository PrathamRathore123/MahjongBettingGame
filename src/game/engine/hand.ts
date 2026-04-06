import { HAND_SIZE } from "../models";
import type { Hand, HandTiles, HonorType, HonorValueMap, Tile } from "../models";
import { createId } from "../utils";
import { drawTiles } from "./deck";

const toHandTiles = (tiles: Tile[]): HandTiles => {
  if (tiles.length !== HAND_SIZE) {
    throw new Error(`Expected ${HAND_SIZE} tiles, got ${tiles.length}.`);
  }

  return [tiles[0], tiles[1], tiles[2]];
};

export const getTileValue = (tile: Tile, honorValues: HonorValueMap): number => {
  if (tile.kind === "number") {
    return tile.rank;
  }

  return honorValues[tile.honor];
};

export const calculateHandTotal = (tiles: Tile[], honorValues: HonorValueMap): number =>
  tiles.reduce((sum, tile) => sum + getTileValue(tile, honorValues), 0);

export const createHand = (tiles: Tile[], honorValues: HonorValueMap): Hand => {
  const handTiles = toHandTiles(tiles);

  return {
    id: createId("hand"),
    tiles: handTiles,
    total: calculateHandTotal(handTiles, honorValues),
  };
};

type DrawHandContext = {
  drawPile: Tile[];
  discardPile: Tile[];
  reshuffleCount: number;
};

export const drawHand = (context: DrawHandContext, honorValues: HonorValueMap) => {
  const drawResult = drawTiles(context, HAND_SIZE);

  return {
    hand: createHand(drawResult.tiles, honorValues),
    drawPile: drawResult.drawPile,
    discardPile: drawResult.discardPile,
    reshuffleCount: drawResult.reshuffleCount,
  };
};

export const getHonorCounts = (tiles: Tile[]): Record<HonorType, number> =>
  tiles.reduce<Record<HonorType, number>>(
    (counts, tile) => {
      if (tile.kind !== "number") {
        counts[tile.honor] += 1;
      }

      return counts;
    },
    {
      east: 0,
      south: 0,
      west: 0,
      north: 0,
      red: 0,
      green: 0,
      white: 0,
    },
  );
