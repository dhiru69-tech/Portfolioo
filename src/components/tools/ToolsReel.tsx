import { useCallback, useEffect, useRef, useState } from "react";
import { ToolPreviewCard } from "./ToolPreviewCard";
import { ToolRow } from "./ToolRow";
import { tools } from "@/data/tools";
import { useTickSound } from "@/hooks/useTickSound";

/** Vertical position of the "active" reading line, as a fraction of the reel window. */
const ACTIVE_LINE = 0.5;
const AMBIENT_SPEED = 34; // px / second
const COPIES = 3;
/** How long a hover keeps priority over the reading line. */
const HOVER_HOLD_MS = 900;
/** A hover only counts if the pointer actually moved (the reel slides under it). */
const POINTER_FRESH_MS = 140;

const wrap = (value: number, max: number) => ((value % max) + max) % max;

export function ToolsReel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const hoveredRef = useRef<number | null>(null);
  const hoverAtRef = useRef(0);
  const pointerMovedAtRef = useRef(0);
  const activeRef = useRef(activeIndex);
  const playTick = useTickSound();

  const setActive = useCallback(
    (next: number) => {
      if (next === activeRef.current) return;
      activeRef.current = next;
      setActiveIndex(next);
      playTick();
    },
    [playTick],
  );

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    let frame = 0;
    let last = performance.now();
    let running = true;
    let rowHeight = rowRef.current?.getBoundingClientRect().height ?? 96;
    let cycle = rowHeight * tools.length;

    const measure = () => {
      rowHeight = rowRef.current?.getBoundingClientRect().height ?? rowHeight;
      cycle = rowHeight * tools.length;
    };
    measure();

    const observer = new ResizeObserver(measure);
    if (rowRef.current) observer.observe(rowRef.current);

    // Pause the loop when the section is off screen (perf).
    const io = new IntersectionObserver(
      ([entry]) => {
        running = Boolean(entry?.isIntersecting);
      },
      { threshold: 0 },
    );
    io.observe(viewport);

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (running) {
        offsetRef.current = wrap(offsetRef.current + AMBIENT_SPEED * dt, cycle);
        track.style.transform = `translate3d(0, ${-offsetRef.current}px, 0)`;

        const hoverFresh = now - hoverAtRef.current < HOVER_HOLD_MS;
        if (hoverFresh && hoveredRef.current !== null) {
          setActive(hoveredRef.current);
        } else if (rowRef.current) {
          const box = viewport.getBoundingClientRect();
          const line = box.top + box.height * ACTIVE_LINE;
          const firstTop = rowRef.current.getBoundingClientRect().top;
          const k = Math.round((line - firstTop - rowHeight / 2) / rowHeight);
          setActive(wrap(k, tools.length));
        }
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    const onPointerMove = () => {
      pointerMovedAtRef.current = performance.now();
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [setActive]);

  const active = tools[activeIndex]!;
  const loop = Array.from({ length: COPIES }, () => tools).flat();

  return (
    <div
      className="relative mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto]"
      onMouseLeave={() => {
        hoveredRef.current = null;
        hoverAtRef.current = 0;
      }}
    >
      <div
        ref={viewportRef}
        className="tool-reel-viewport relative overflow-hidden"
        aria-label="Tools and technologies"
      >
        <div ref={trackRef} className="will-change-transform">
          {loop.map((tool, i) => {
            const index = i % tools.length;
            return (
              <div key={i} ref={i === 0 ? rowRef : undefined} className="tool-row-wrap">
                <ToolRow
                  name={tool.name}
                  category={tool.category}
                  active={index === activeIndex}
                  onActivate={() => {
                    const now = performance.now();
                    if (now - pointerMovedAtRef.current > POINTER_FRESH_MS) return;
                    hoveredRef.current = index;
                    hoverAtRef.current = now;
                    setActive(index);
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#050505] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#050505] to-transparent" />
      </div>

      <div className="flex justify-center lg:justify-end">
        <ToolPreviewCard tool={active} />
      </div>
    </div>
  );
}
