import { DRAGON_TYPES, WIND_TYPES } from "./tile";
import type { HonorType } from "./tile";

export const HONOR_START_VALUE = 5;
export const HONOR_MIN_VALUE = 0;
export const HONOR_MAX_VALUE = 10;

export type HonorValueMap = Record<HonorType, number>;

export const createInitialHonorValues = (): HonorValueMap => ({
  east: HONOR_START_VALUE,
  south: HONOR_START_VALUE,
  west: HONOR_START_VALUE,
  north: HONOR_START_VALUE,
  red: HONOR_START_VALUE,
  green: HONOR_START_VALUE,
  white: HONOR_START_VALUE,
});

export const ALL_HONOR_TYPES: HonorType[] = [...WIND_TYPES, ...DRAGON_TYPES];
