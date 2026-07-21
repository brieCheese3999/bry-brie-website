import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type PixelateMode =
    | "reveal"     // pixelated → crisp (original behaviour, stops at endPixel)
    | "oscillate"; // bounces back and forth between pixelMin and pixelMax forever

interface UsePixelateOptions {
  /**
   * "reveal"    — animates from startPixel → endPixel once, then stops. (default)
   * "oscillate" — bounces forever between pixelMin and pixelMax.
   */
  mode?: PixelateMode;

  // ── reveal mode options ──────────────────────
  /** Total duration of the reveal animation in ms. Default: 2000 */
  duration?: number;
  /** Starting pixel block size for reveal. Higher = chunkier. Default: 40 */
  startPixel?: number;
  /** Ending pixel block size for reveal. 1 = fully crisp. Default: 1 */
  endPixel?: number;
  /** Easing for reveal mode. Default: easeOutQuad */
  easing?: (t: number) => number;
  /** Called when reveal animation completes */
  onComplete?: () => void;

  // ── oscillate mode options ───────────────────
  /** Minimum pixel block size (least pixelated). Default: 4 */
  pixelMin?: number;
  /** Maximum pixel block size (most pixelated). Default: 20 */
  pixelMax?: number;
  /**
   * How long one full oscillation cycle takes in ms (min → max → min).
   * Default: 3000
   */
  cycleDuration?: number;
}

// ─────────────────────────────────────────────
// Easing helpers
// ─────────────────────────────────────────────

/** Starts fast, slows at the end */
const easeOutQuad = (t: number): number => 1 - (1 - t) * (1 - t);

/**
 * Sine wave easing — produces a smooth, natural-feeling oscillation.
 * Returns a value between 0 and 1 that goes 0 → 1 → 0 over one full cycle.
 */
const sineOscillate = (t: number): number =>
    (1 - Math.cos(t * 2 * Math.PI)) / 2;

// ─────────────────────────────────────────────
// Core drawing helper
// ─────────────────────────────────────────────

function drawPixelated(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    pixelSize: number,
    canvasW: number,
    canvasH: number
): void {
  if (pixelSize <= 1) {
    // Full resolution — draw directly
    ctx.imageSmoothingEnabled = true;
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.drawImage(img, 0, 0, canvasW, canvasH);
    return;
  }

  const scaledW = Math.max(1, Math.ceil(canvasW / pixelSize));
  const scaledH = Math.max(1, Math.ceil(canvasH / pixelSize));

  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvasW, canvasH);

  // Step 1: draw tiny
  ctx.drawImage(img, 0, 0, scaledW, scaledH);
  // Step 2: scale back up — browser with imageSmoothingEnabled=false keeps hard pixel edges
  ctx.drawImage(ctx.canvas, 0, 0, scaledW, scaledH, 0, 0, canvasW, canvasH);
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

/**
 * usePixelate
 *
 * Two modes:
 *
 * 1. REVEAL (default) — image animates from pixelated → crisp over `duration` ms.
 *    Perfect for scroll-triggered image reveals on gallery/travel pages.
 *
 * 2. OSCILLATE — image bounces between `pixelMin` and `pixelMax` forever.
 *    Perfect for a living, breathing hero background that stays pixelated.
 *
 * @example — reveal
 * const ref = usePixelate(src, { mode: "reveal", duration: 2000, startPixel: 40 });
 *
 * @example — oscillate
 * const ref = usePixelate(src, { mode: "oscillate", pixelMin: 4, pixelMax: 20, cycleDuration: 3000 });
 */
export function usePixelate(
    src: string,
    {
      mode = "reveal",

      // reveal
      duration = 2000,
      startPixel = 40,
      endPixel = 1,
      easing = easeOutQuad,
      onComplete,

      // oscillate
      pixelMin = 4,
      pixelMax = 20,
      cycleDuration = 3000,
    }: UsePixelateOptions = {}
): React.RefObject<HTMLCanvasElement> {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    let animationFrameId: number;

    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const startTime = performance.now();

      // ── OSCILLATE loop ──────────────────────
      if (mode === "oscillate") {
        const oscillate = (now: number): void => {
          const elapsed = now - startTime;

          // Progress within current cycle: 0 → 1, repeating
          const cycleProgress = (elapsed % cycleDuration) / cycleDuration;

          // Sine gives smooth 0→1→0 within each cycle
          const wave = sineOscillate(cycleProgress);

          // Map wave (0–1) to pixel range (pixelMin–pixelMax)
          const pixelSize = Math.round(pixelMin + (pixelMax - pixelMin) * wave);

          drawPixelated(ctx, img, pixelSize, canvas.width, canvas.height);

          animationFrameId = requestAnimationFrame(oscillate);
        };

        animationFrameId = requestAnimationFrame(oscillate);
        return;
      }

      // ── REVEAL (one-shot) ───────────────────
      const reveal = (now: number): void => {
        const elapsed = now - startTime;
        const rawProgress = Math.min(elapsed / duration, 1);
        const easedProgress = easing(rawProgress);

        const pixelSize = Math.max(
            endPixel,
            Math.round(startPixel - (startPixel - endPixel) * easedProgress)
        );

        drawPixelated(ctx, img, pixelSize, canvas.width, canvas.height);

        if (rawProgress < 1) {
          animationFrameId = requestAnimationFrame(reveal);
        } else {
          // Final crisp draw
          ctx.imageSmoothingEnabled = true;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          onComplete?.();
        }
      };

      animationFrameId = requestAnimationFrame(reveal);
    };

    img.onerror = () => {
      console.error(`[usePixelate] Failed to load image: ${src}`);
    };

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [src, mode, duration, startPixel, endPixel, easing, onComplete, pixelMin, pixelMax, cycleDuration]);

  return canvasRef;
}

export type { UsePixelateOptions, PixelateMode };