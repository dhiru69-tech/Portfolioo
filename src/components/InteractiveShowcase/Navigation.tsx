import { memo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface NavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  disabledPrevious?: boolean;
  disabledNext?: boolean;
}

const buttonClass =
  "inline-flex size-9 items-center justify-center rounded-full border border-[var(--isc-border-strong)] bg-[var(--isc-surface)] text-[var(--isc-muted)] " +
  "transition-[color,background-color,transform,border-color] duration-300 ease-out " +
  "hover:-translate-y-px hover:border-[var(--isc-accent)]/60 hover:bg-[var(--isc-surface-strong)] hover:text-[var(--isc-fg)] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--isc-accent)]/60 active:translate-y-0 active:scale-95 " +
  "disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0";

function NavigationBase({
  onPrevious,
  onNext,
  disabledPrevious,
  disabledNext,
}: NavigationProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onPrevious}
        disabled={disabledPrevious}
        aria-label="Previous item"
        className={buttonClass}
      >
        <ChevronUp className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={disabledNext}
        aria-label="Next item"
        className={buttonClass}
      >
        <ChevronDown className="size-4" aria-hidden />
      </button>
    </div>
  );
}

export const Navigation = memo(NavigationBase);