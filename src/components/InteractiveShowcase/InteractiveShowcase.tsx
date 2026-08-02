import { useCallback, useEffect, useRef, useState } from "react";
import { MousePointerClick } from "lucide-react";

import { cn } from "@/lib/utils";
import { AnimatedCursor } from "./AnimatedCursor";
import { ItemList } from "./ItemList";
import { Navigation } from "./Navigation";
import { PreviewCard } from "./PreviewCard";
import { ProgressIndicator } from "./ProgressIndicator";
import { DEFAULT_ACCENT, PREVIEW_SIZES } from "./constants";
import { useActiveItem } from "./hooks/useActiveItem";
import { useMouseFollow } from "./hooks/useMouseFollow";
import { useSound } from "./hooks/useSound";
import { useFinePointer, useReducedMotion } from "./hooks/usePointerCapabilities";
import { themeStyle } from "./theme";
import type { InteractiveShowcaseProps } from "./types";

export function InteractiveShowcase({
  items,
  defaultIndex = 0,
  index,
  onIndexChange,
  onItemSelect,
  theme = "dark",
  accentColor = DEFAULT_ACCENT,
  animationSpeed = 1,
  previewSize = "lg",
  soundEnabled = true,
  soundVolume = 0.18,
  activateOnHover = true,
  scrollToNavigate = true,
  loop = true,
  showCursor = true,
  showProgress = true,
  showNavigation = true,
  hint = "Hover, scroll or use arrow keys",
  label = "Showcase items",
  className,
  lottieRenderer,
}: InteractiveShowcaseProps) {
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const wheelLock = useRef(0);
  const [pointerInside, setPointerInside] = useState(false);

  const playTick = useSound({
    enabled: soundEnabled && finePointer,
    volume: soundVolume,
  });

  const handleChange = useCallback(
    (next: number) => {
      playTick();
      const item = items[next];
      if (item) onIndexChange?.(next, item);
    },
    [items, onIndexChange, playTick],
  );

  const { active, direction, setActive, next, previous } = useActiveItem({
    count: items.length,
    defaultIndex,
    loop,
    onChange: handleChange,
    ...(index == null ? {} : { index }),
  });

  const follow = useMouseFollow({ enabled: finePointer && !reducedMotion });

  // Keyboard: arrows, home/end, page up/down.
  useEffect(() => {
    const node = listRef.current;
    if (!node) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const map: Record<string, () => void> = {
        ArrowDown: next,
        ArrowRight: next,
        PageDown: next,
        ArrowUp: previous,
        ArrowLeft: previous,
        PageUp: previous,
        Home: () => setActive(0),
        End: () => setActive(items.length - 1),
      };
      const action = map[event.key];
      if (!action) return;
      event.preventDefault();
      action();
    };
    node.addEventListener("keydown", onKeyDown);
    return () => node.removeEventListener("keydown", onKeyDown);
  }, [items.length, next, previous, setActive]);

  const onWheel = useCallback(
    (event: React.WheelEvent) => {
      if (!scrollToNavigate || !finePointer) return;
      const now = performance.now();
      if (now - wheelLock.current < 260) return;
      if (Math.abs(event.deltaY) < 8) return;
      const atEdge =
        !loop &&
        ((event.deltaY > 0 && active === items.length - 1) ||
          (event.deltaY < 0 && active === 0));
      if (atEdge) return;
      wheelLock.current = now;
      if (event.deltaY > 0) next();
      else previous();
    },
    [active, finePointer, items.length, loop, next, previous, scrollToNavigate],
  );

  const handleSelect = useCallback(
    (item: (typeof items)[number]) => onItemSelect?.(item),
    [onItemSelect],
  );

  if (items.length === 0) return null;

  const activeItem = items[active];
  const resolvedAccent = activeItem?.accentColor ?? accentColor;

  return (
    <div
      ref={containerRef}
      style={themeStyle(theme, resolvedAccent)}
      onPointerMove={follow.onPointerMove}
      onPointerEnter={() => setPointerInside(true)}
      onPointerLeave={() => {
        setPointerInside(false);
        follow.reset();
      }}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-[1.75rem] p-4 sm:p-6 lg:p-8",
        "border border-[var(--isc-border)] bg-[var(--isc-surface)] backdrop-blur-2xl",
        "transition-colors duration-500",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ boxShadow: "var(--isc-shadow)" }}
      />

      {showCursor && finePointer && !reducedMotion && (
        <AnimatedCursor containerRef={containerRef} visible={pointerInside} />
      )}

      <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
        <div
          className="flex flex-col justify-between gap-6"
          onWheel={onWheel}
        >
          <ItemList
            items={items}
            active={active}
            onActivate={setActive}
            onSelect={handleSelect}
            activateOnHover={activateOnHover && finePointer}
            reducedMotion={reducedMotion}
            label={label}
            listRef={listRef}
          />

          {(showNavigation || showProgress) && (
            <div className="flex items-center justify-between gap-4 px-2">
              {showNavigation ? (
                <Navigation
                  onPrevious={previous}
                  onNext={next}
                  disabledPrevious={!loop && active === 0}
                  disabledNext={!loop && active === items.length - 1}
                />
              ) : (
                <span />
              )}
              {showProgress && (
                <ProgressIndicator
                  current={active}
                  total={items.length}
                  reducedMotion={reducedMotion}
                />
              )}
            </div>
          )}
        </div>

        <div className={cn("w-full justify-self-center", PREVIEW_SIZES[previewSize])}>
          <div ref={follow.ref}>
            <PreviewCard
              item={activeItem}
              direction={direction}
              speed={animationSpeed}
              reducedMotion={reducedMotion}
              x={follow.x}
              y={follow.y}
              rotateX={follow.rotateX}
              rotateY={follow.rotateY}
              onSelect={handleSelect}
              {...(lottieRenderer ? { lottieRenderer } : {})}
            />
          </div>
        </div>
      </div>

      {hint && (
        <p className="relative z-10 mt-8 flex items-center justify-center gap-2 text-xs tracking-[0.14em] text-[var(--isc-faint)]">
          <MousePointerClick className="size-3.5" aria-hidden />
          {hint}
        </p>
      )}
    </div>
  );
}