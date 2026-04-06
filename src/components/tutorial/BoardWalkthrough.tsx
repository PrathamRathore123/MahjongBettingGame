import { useEffect, useMemo, useState } from "react";
import type { BoardWalkthroughStep } from "../../data/boardWalkthroughSteps";

type BoardWalkthroughProps = {
  isOpen: boolean;
  step: BoardWalkthroughStep;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onSkip: () => void;
};

type TooltipPlacement = {
  top: number;
  left: number;
};

const TOOLTIP_WIDTH = 292;
const TOOLTIP_GAP = 14;
const VIEWPORT_MARGIN = 12;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

function getTooltipPosition(step: BoardWalkthroughStep, rect: DOMRect | null): TooltipPlacement {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const estimatedHeight = 166;

  if (!rect || step.placement === "center") {
    return {
      top: (viewportHeight - estimatedHeight) / 2,
      left: (viewportWidth - TOOLTIP_WIDTH) / 2,
    };
  }

  let top = rect.bottom + TOOLTIP_GAP;
  let left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;

  if (step.placement === "top") {
    top = rect.top - estimatedHeight - TOOLTIP_GAP;
  }

  if (step.placement === "left") {
    left = rect.left - TOOLTIP_WIDTH - TOOLTIP_GAP;
    top = rect.top + rect.height / 2 - estimatedHeight / 2;
  }

  if (step.placement === "right") {
    left = rect.right + TOOLTIP_GAP;
    top = rect.top + rect.height / 2 - estimatedHeight / 2;
  }

  top = clamp(top, VIEWPORT_MARGIN, viewportHeight - estimatedHeight - VIEWPORT_MARGIN);
  left = clamp(left, VIEWPORT_MARGIN, viewportWidth - TOOLTIP_WIDTH - VIEWPORT_MARGIN);

  return { top, left };
}

function BoardWalkthrough({ isOpen, step, stepIndex, totalSteps, onNext, onSkip }: BoardWalkthroughProps) {
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const updateTargetRect = () => {
      if (!step.targetKey) {
        setTargetRect(null);
        return;
      }

      const targetElement = document.querySelector<HTMLElement>(
        `[data-tour="${step.targetKey}"], [data-wt-target="${step.targetKey}"]`,
      );
      setTargetRect(targetElement?.getBoundingClientRect() ?? null);
    };

    updateTargetRect();
    window.addEventListener("resize", updateTargetRect);
    window.addEventListener("scroll", updateTargetRect, true);

    return () => {
      window.removeEventListener("resize", updateTargetRect);
      window.removeEventListener("scroll", updateTargetRect, true);
    };
  }, [isOpen, step.targetKey]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onSkip();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onSkip]);

  const tooltipPosition = useMemo(() => getTooltipPosition(step, targetRect), [step, targetRect]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 animate-[draw-in_220ms_ease]" onClick={onNext}>
      <div className="absolute inset-0 bg-black/50" />

      {targetRect ? (
        <div
          className="pointer-events-none absolute rounded-[14px] border-2 border-[#d4af37] shadow-[0_0_0_9999px_rgba(0,0,0,0.5),0_0_18px_rgba(212,175,55,0.7)] transition-all duration-200"
          style={{
            top: targetRect.top - 4,
            left: targetRect.left - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
          }}
        />
      ) : null}

      <div
        className="absolute w-[292px] rounded-[12px] border border-[#d4af37]/80 bg-gradient-to-b from-[#153f37] to-[#0f2d29] p-3 text-[#f1e3b8] shadow-[0_14px_24px_rgba(0,0,0,0.42)] transition-all duration-200"
        style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
        onClick={onNext}
      >
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-bold leading-tight">{step.title}</h3>
          <button
            className="rounded px-2 py-1 text-[12px] font-semibold text-[#d8c897] hover:bg-[#d4af37]/10"
            onClick={(event) => {
              event.stopPropagation();
              onSkip();
            }}
          >
            Skip
          </button>
        </div>

        <p className="text-[13px] leading-relaxed text-[#d8e4d6]">{step.text}</p>

        <div className="mt-2.5 flex items-center justify-between border-t border-[#d4af37]/25 pt-2 text-[11px] text-[#bfcdbf]">
          <span>{stepIndex + 1}/{totalSteps}</span>
          <span>{stepIndex + 1 === totalSteps ? "Click anywhere to start" : "Tap anywhere to continue"}</span>
        </div>
      </div>
    </div>
  );
}

export default BoardWalkthrough;
