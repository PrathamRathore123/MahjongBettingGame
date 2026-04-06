import { useCallback, useMemo, useState } from "react";
import { boardWalkthroughSteps } from "../data/boardWalkthroughSteps";

const BOARD_WALKTHROUGH_STORAGE_KEY = "mahjong-board-walkthrough-complete";

const hasCompletedWalkthrough = (): boolean => {
  try {
    return localStorage.getItem(BOARD_WALKTHROUGH_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

const saveWalkthroughComplete = () => {
  try {
    localStorage.setItem(BOARD_WALKTHROUGH_STORAGE_KEY, "1");
  } catch {
    return;
  }
};

export function useBoardWalkthrough() {
  const [isOpen, setIsOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [completed, setCompleted] = useState(hasCompletedWalkthrough);

  const totalSteps = boardWalkthroughSteps.length;
  const currentStep = boardWalkthroughSteps[stepIndex] ?? boardWalkthroughSteps[0];

  const start = useCallback(() => {
    setStepIndex(0);
    setIsOpen(true);
  }, []);

  const closeAndComplete = useCallback(() => {
    saveWalkthroughComplete();
    setCompleted(true);
    setIsOpen(false);
  }, []);

  const skip = useCallback(() => {
    closeAndComplete();
  }, [closeAndComplete]);

  const next = useCallback(() => {
    setStepIndex((current) => {
      const nextIndex = current + 1;
      if (nextIndex >= totalSteps) {
        closeAndComplete();
        return current;
      }
      return nextIndex;
    });
  }, [closeAndComplete, totalSteps]);

  const shouldAutoRun = useMemo(() => !completed, [completed]);

  return {
    isOpen,
    currentStep,
    stepIndex,
    totalSteps,
    shouldAutoRun,
    start,
    skip,
    next,
  };
}

