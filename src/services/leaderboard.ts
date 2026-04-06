import { LEADERBOARD_LIMIT } from "../game/models";
import type { LeaderboardEntry } from "../game/models";
import { createId } from "../game/utils";

const LEADERBOARD_KEY = "hand-betting-game:leaderboard";
const DEFAULT_PLAYER_NAME = "Player 1";

const isBrowser = () => typeof window !== "undefined";

const sortLeaderboard = (entries: LeaderboardEntry[]): LeaderboardEntry[] =>
  entries
    .slice()
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return b.createdAt - a.createdAt;
    })
    .slice(0, LEADERBOARD_LIMIT);

const normalizePlayerName = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) {
    return DEFAULT_PLAYER_NAME;
  }

  return trimmed.slice(0, 24);
};

const parseStoredData = (rawValue: string | null): LeaderboardEntry[] => {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((entry) => {
        if (
          typeof entry === "object" &&
          entry !== null &&
          "id" in entry &&
          "score" in entry &&
          "createdAt" in entry &&
          typeof entry.id === "string" &&
          typeof entry.score === "number" &&
          typeof entry.createdAt === "number"
        ) {
          return {
            id: entry.id,
            name:
              "name" in entry && typeof entry.name === "string"
                ? normalizePlayerName(entry.name)
                : DEFAULT_PLAYER_NAME,
            score: entry.score,
            createdAt: entry.createdAt,
          } satisfies LeaderboardEntry;
        }

        return null;
      })
      .filter((entry): entry is LeaderboardEntry => entry !== null);
  } catch {
    return [];
  }
};

export const getLeaderboard = (): LeaderboardEntry[] => {
  if (!isBrowser()) {
    return [];
  }

  const rawValue = window.localStorage.getItem(LEADERBOARD_KEY);
  return sortLeaderboard(parseStoredData(rawValue));
};

const saveLeaderboard = (entries: LeaderboardEntry[]) => {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
};

export const addLeaderboardScore = (score: number, playerName?: string): LeaderboardEntry[] => {
  const current = getLeaderboard();
  const next = sortLeaderboard([
    ...current,
    {
      id: createId("score"),
      name: normalizePlayerName(playerName ?? DEFAULT_PLAYER_NAME),
      score,
      createdAt: Date.now(),
    },
  ]);

  saveLeaderboard(next);
  return next;
};
