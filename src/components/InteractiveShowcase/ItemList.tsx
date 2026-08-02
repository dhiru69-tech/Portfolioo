import { memo, useId } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { listItemVariants, EASE_OUT } from "./animations";
import { SPRING_RAIL } from "./constants";
import type { ShowcaseItem } from "./types";

interface ItemListProps {
  items: ShowcaseItem[];
  active: number;
  onActivate: (index: number) => void;
  onSelect: (item: ShowcaseItem) => void;
  activateOnHover: boolean;
  reducedMotion: boolean;
  label: string;
  listRef: React.RefObject<HTMLDivElement | null>;
}

function ItemListBase({
  items,
  active,
  onActivate,
  onSelect,
  activateOnHover,
  reducedMotion,
  label,
  listRef,
}: ItemListProps) {
  const railId = useId();

  return (
    <div
      ref={listRef}
      role="listbox"
      aria-label={label}
      aria-activedescendant={`${railId}-${active}`}
      tabIndex={0}
      className="relative -mx-2 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--isc-accent)]/50 focus-visible:ring-offset-0"
    >
      {items.map((item, i) => {
        const isActive = i === active;
        return (
          <motion.div
            key={item.id}
            custom={i}
            {...(reducedMotion
              ? {}
              : {
                  variants: listItemVariants,
                  initial: "hidden" as const,
                  animate: "visible" as const,
                })}
            className="relative"
          >
            {isActive && (
              <motion.span
                layoutId={`${railId}-highlight`}
                transition={reducedMotion ? { duration: 0 } : { type: "spring", ...SPRING_RAIL }}
                aria-hidden
                className="absolute inset-0 rounded-xl border border-[var(--isc-border-strong)] bg-[var(--isc-surface-strong)]"
                style={{
                  boxShadow:
                    "0 1px 0 0 color-mix(in oklab, var(--isc-fg) 8%, transparent) inset",
                }}
              />
            )}

            <button
              type="button"
              id={`${railId}-${i}`}
              role="option"
              aria-selected={isActive}
              tabIndex={-1}
              onMouseEnter={activateOnHover ? () => onActivate(i) : undefined}
              onFocus={() => onActivate(i)}
              onClick={() => {
                onActivate(i);
                onSelect(item);
              }}
              className={cn(
                "group relative flex w-full items-baseline gap-5 rounded-xl px-4 py-4 text-left",
                "transition-colors duration-300 sm:gap-7 sm:px-5 sm:py-5",
                "border-b border-[var(--isc-border)] last:border-b-0",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId={`${railId}-marker`}
                  transition={
                    reducedMotion ? { duration: 0 } : { type: "spring", ...SPRING_RAIL }
                  }
                  aria-hidden
                  className="absolute left-0 top-1/2 h-[58%] w-px -translate-y-1/2 bg-[var(--isc-accent)]"
                  style={{
                    boxShadow: "0 0 14px 1px color-mix(in oklab, var(--isc-accent) 60%, transparent)",
                  }}
                />
              )}

              <motion.span
                aria-hidden
                animate={{
                  opacity: isActive ? 1 : 0.34,
                  scale: isActive ? 1 : 0.82,
                  color: isActive ? "var(--isc-fg)" : "var(--isc-muted)",
                }}
                transition={reducedMotion ? { duration: 0 } : { duration: 0.45, ease: EASE_OUT }}
                className="w-14 origin-left shrink-0 text-3xl font-semibold tabular-nums tracking-tight sm:text-4xl"
              >
                {String(i + 1).padStart(2, "0")}
              </motion.span>

              <span className="min-w-0 flex-1">
                <motion.span
                  animate={{
                    opacity: isActive ? 1 : 0.6,
                    color: isActive ? "var(--isc-fg)" : "var(--isc-muted)",
                  }}
                  transition={reducedMotion ? { duration: 0 } : { duration: 0.4, ease: EASE_OUT }}
                  className={cn(
                    "block truncate tracking-tight transition-[font-size] duration-500",
                    isActive ? "text-xl sm:text-2xl" : "text-lg sm:text-xl",
                    "group-hover:opacity-100",
                  )}
                >
                  {item.title}
                </motion.span>
                {item.subtitle && (
                  <motion.span
                    animate={{ opacity: isActive ? 1 : 0.55 }}
                    transition={reducedMotion ? { duration: 0 } : { duration: 0.4, ease: EASE_OUT }}
                    className={cn(
                      "mt-1 block truncate text-[0.8125rem]",
                      isActive ? "text-[var(--isc-accent)]" : "text-[var(--isc-faint)]",
                    )}
                  >
                    {item.subtitle}
                  </motion.span>
                )}
              </span>
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}

export const ItemList = memo(ItemListBase);