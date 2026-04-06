export type BoardWalkthroughTargetKey =
  | "current-hand"
  | "hand-total"
  | "bet-controls"
  | "previous-hands"
  | "special-tiles"
  | "top-stats";

export type BoardWalkthroughPlacement = "top" | "bottom" | "left" | "right" | "center";

export type BoardWalkthroughStep = {
  id: string;
  targetKey: BoardWalkthroughTargetKey | null;
  title: string;
  text: string;
  placement: BoardWalkthroughPlacement;
};

export const boardWalkthroughSteps: BoardWalkthroughStep[] = [
  {
    id: "current-hand",
    targetKey: "current-hand",
    title: "This is your current hand",
    text: "You start each round with 3 Mahjong tiles. Their values combine to make your hand total.",
    placement: "top",
  },
  {
    id: "hand-total",
    targetKey: "hand-total",
    title: "Watch the total",
    text: "This number is the total value of your current hand. You will predict whether the next hand is higher or lower.",
    placement: "bottom",
  },
  {
    id: "bet-controls",
    targetKey: "bet-controls",
    title: "Make your prediction",
    text: "Choose Bet Higher if you think the next hand total will go up. Choose Bet Lower if you think it will go down.",
    placement: "top",
  },
  {
    id: "previous-hands",
    targetKey: "previous-hands",
    title: "Check previous rounds",
    text: "This area shows earlier hands, totals, and whether you won or lost each round.",
    placement: "left",
  },
  {
    id: "special-tiles",
    targetKey: "special-tiles",
    title: "Special tiles can change",
    text: "Number tiles use their face value. Winds and Dragons start at 5 and can go up or down depending on wins and losses.",
    placement: "bottom",
  },
  {
    id: "top-stats",
    targetKey: "top-stats",
    title: "Keep an eye on the game state",
    text: "Watch your score, the draw pile, discard pile, and reshuffles. The game ends if a special tile reaches 0 or 10, or reshuffles reach 3.",
    placement: "bottom",
  },
  {
    id: "ready",
    targetKey: null,
    title: "You're ready",
    text: "That's it. Start playing and try to build the highest score you can.",
    placement: "center",
  },
];
