import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [show, setShow] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 1.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.button
      type="button"
      aria-label="Back to top"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
      }
      initial={false}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 12, pointerEvents: show ? "auto" : "none" }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel fixed bottom-5 right-5 z-40 grid h-11 w-11 place-items-center rounded-full text-foreground transition-colors duration-300 hover:border-primary/60 hover:text-primary"
    >
      <ArrowUp size={17} aria-hidden="true" />
    </motion.button>
  );
}
