import { useEffect, useRef } from "react";
import { useMotionIntensity } from "@/hooks/useMotionIntensity";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  label?: string;
};

const LABELS = ["Cybersecurity", "Development", "OSINT", "CTFs", "Research", "Automation"];

/**
 * Lightweight canvas 2D network visualisation — nodes drifting and linking,
 * reacting subtly to the pointer. Deliberately not WebGL: the scene is a few
 * dozen points, so a 2D context renders it with a fraction of the memory and
 * no context-loss handling. Rendering pauses whenever the canvas is offscreen
 * or the tab is hidden, and stops entirely under reduced motion (a single
 * static frame is drawn instead).
 */
export function CyberNetwork({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { intensity, reduced, tier } = useMotionIntensity();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const count = tier === "mobile" ? 16 : tier === "tablet" ? 24 : 34;
    const linkDist = tier === "mobile" ? 120 : 150;
    const dpr = Math.min(window.devicePixelRatio || 1, tier === "desktop" ? 2 : 1.5);

    let width = 0;
    let height = 0;
    let raf: number | null = null;
    let visible = true;
    const pointer = { x: -9999, y: -9999 };
    const nodes: Node[] = [];

    const seed = () => {
      nodes.length = 0;
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.16,
          vy: (Math.random() - 0.5) * 0.16,
          r: i < LABELS.length ? 3.2 : 1.5 + Math.random() * 1.2,
          label: i < LABELS.length ? LABELS[i] : undefined,
        });
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!nodes.length) seed();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d > linkDist) continue;
          const alpha = (1 - d / linkDist) * 0.32;
          ctx.strokeStyle = `rgba(200, 200, 200, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        const glow = n.label ? 0.95 : 0.55;
        ctx.fillStyle = n.label
          ? `rgba(255, 255, 255, ${glow})`
          : `rgba(180, 180, 180, ${glow * 0.6})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();

        if (n.label) {
          ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 0.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.font = "500 10px ui-monospace, 'JetBrains Mono', monospace";
          ctx.fillStyle = "rgba(220, 220, 220, 0.62)";
          ctx.fillText(n.label, n.x + 8, n.y + 3.5);
        }
      }
    };

    const step = () => {
      const speed = 0.35 + 0.65 * intensity;
      for (const n of nodes) {
        n.x += n.vx * speed;
        n.y += n.vy * speed;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        n.x = Math.max(0, Math.min(width, n.x));
        n.y = Math.max(0, Math.min(height, n.y));

        const dx = n.x - pointer.x;
        const dy = n.y - pointer.y;
        const d = Math.hypot(dx, dy);
        if (d < 110 && d > 0.01) {
          const push = ((110 - d) / 110) * 0.35;
          n.x += (dx / d) * push;
          n.y += (dy / d) * push;
        }
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (raf === null && visible && !reduced) raf = requestAnimationFrame(step);
    };
    const stop = () => {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
    };

    resize();
    draw();

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") start();
      else stop();
    };

    canvas.addEventListener("pointermove", onPointer);
    canvas.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      nodes.length = 0;
    };
  }, [intensity, reduced, tier]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role="img"
      aria-label="Animated diagram of connected nodes labelled cybersecurity, development, OSINT, CTFs, research and automation"
    />
  );
}
