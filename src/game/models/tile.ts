export const NUMBER_SUITS = ["bamboo", "characters", "dots"] as const;
export const NUMBER_RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
export const WIND_TYPES = ["east", "south", "west", "north"] as const;
export const DRAGON_TYPES = ["red", "green", "white"] as const;

export type NumberSuit = (typeof NUMBER_SUITS)[number];
export type NumberRank = (typeof NUMBER_RANKS)[number];
export type WindType = (typeof WIND_TYPES)[number];
export type DragonType = (typeof DRAGON_TYPES)[number];
export type HonorType = WindType | DragonType;

type TileBase = {
  id: string;
  label: string;
};

export type NumberTile = TileBase & {
  kind: "number";
  suit: NumberSuit;
  rank: NumberRank;
};

export type WindTile = TileBase & {
  kind: "wind";
  honor: WindType;
};

export type DragonTile = TileBase & {
  kind: "dragon";
  honor: DragonType;
};

export type Tile = NumberTile | WindTile | DragonTile;
