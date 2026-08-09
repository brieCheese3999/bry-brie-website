import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type PixelateMode =
    | "reveal"     // pixelated → crisp (original behaviour, stops at endPixel)
    | "oscillate"  // bounces back and forth between pixelMin and pixelMax forever
    | "ring"       // only the area OUTSIDE a central ellipse is pixelated; the
                   // centre stays crisp. Pixel size oscillates for a living mosaic.
    | "spots";     // only a few rectangular patches are pixelated; the rest of
                   // the image stays crisp. Pixel size oscillates.

/** A rectangular patch, as fractions (0–1) of the canvas. */
interface Spot {
  x: number;
  y: number;
  w: number;
  h: number;
}

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

  // ── ring mode options ────────────────────────
  /** Horizontal centre of the crisp ellipse, as a fraction of width. Default: 0.5 */
  centerX?: number;
  /** Vertical centre of the crisp ellipse, as a fraction of height. Default: 0.5 */
  centerY?: number;
  /** Horizontal radius of the crisp ellipse, as a fraction of width. Default: 0.26 */
  radiusX?: number;
  /** Vertical radius of the crisp ellipse, as a fraction of height. Default: 0.34 */
  radiusY?: number;
  /**
   * Softness of the transition from crisp centre → pixelated ring, as a
   * fraction of the radius (0 = hard edge, 1 = very gradual). Default: 0.4
   */
  feather?: number;

  // ── spots mode options ───────────────────────
  /**
   * Rectangular patches (fractions of the canvas) that get pixelated in
   * "spots" mode. Everything outside them stays crisp. Default: [] (none).
   */
  spots?: Spot[];
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

interface RingRegion {
  centerX: number; // fractions of canvas 0–1
  centerY: number;
  radiusX: number;
  radiusY: number;
  feather: number;
}

/**
 * Draws the crisp image, then overlays a pixelated (mosaic) copy everywhere
 * EXCEPT a central ellipse — leaving the middle sharp and the surrounding
 * area chunky. A feathered radial mask blends the two so the seam is soft.
 */
function drawRing(
    ctx: CanvasRenderingContext2D,
    scratch: HTMLCanvasElement,
    img: HTMLImageElement,
    pixelSize: number,
    canvasW: number,
    canvasH: number,
    region: RingRegion
): void {
  // Base: crisp full-resolution image
  ctx.imageSmoothingEnabled = true;
  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.drawImage(img, 0, 0, canvasW, canvasH);

  // Build the pixelated layer on the scratch canvas
  const sctx = scratch.getContext("2d");
  if (!sctx) return;

  const scaledW = Math.max(1, Math.ceil(canvasW / pixelSize));
  const scaledH = Math.max(1, Math.ceil(canvasH / pixelSize));

  sctx.globalCompositeOperation = "source-over";
  sctx.imageSmoothingEnabled = false;
  sctx.clearRect(0, 0, canvasW, canvasH);
  sctx.drawImage(img, 0, 0, scaledW, scaledH);
  sctx.drawImage(scratch, 0, 0, scaledW, scaledH, 0, 0, canvasW, canvasH);

  // Punch a feathered hole in the centre of the pixel layer so the crisp
  // base shows through. destination-out: higher alpha erases more.
  const cx = canvasW * region.centerX;
  const cy = canvasH * region.centerY;
  const rx = canvasW * region.radiusX;
  const ry = canvasH * region.radiusY;

  sctx.globalCompositeOperation = "destination-out";
  sctx.save();
  sctx.translate(cx, cy);
  sctx.scale(rx, ry); // work in a unit circle, scaled into an ellipse
  const g = sctx.createRadialGradient(0, 0, 0, 0, 0, 1);
  g.addColorStop(0, "rgba(0,0,0,1)");
  g.addColorStop(Math.max(0, 1 - region.feather), "rgba(0,0,0,1)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  sctx.fillStyle = g;
  sctx.beginPath();
  sctx.arc(0, 0, 1, 0, Math.PI * 2);
  sctx.fill();
  sctx.restore();
  sctx.globalCompositeOperation = "source-over";

  // Composite the ring-shaped pixel layer over the crisp base
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(scratch, 0, 0);
}

/**
 * Draws the crisp image, then overlays a pixelated copy clipped to only a few
 * rectangular patches — leaving the rest of the image sharp.
 */
function drawSpots(
    ctx: CanvasRenderingContext2D,
    scratch: HTMLCanvasElement,
    img: HTMLImageElement,
    pixelSize: number,
    canvasW: number,
    canvasH: number,
    spots: Spot[]
): void {
  // Base: crisp full-resolution image
  ctx.imageSmoothingEnabled = true;
  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.drawImage(img, 0, 0, canvasW, canvasH);

  if (spots.length === 0) return;

  const sctx = scratch.getContext("2d");
  if (!sctx) return;

  // Build the pixelated layer on the scratch canvas
  const scaledW = Math.max(1, Math.ceil(canvasW / pixelSize));
  const scaledH = Math.max(1, Math.ceil(canvasH / pixelSize));

  sctx.globalCompositeOperation = "source-over";
  sctx.imageSmoothingEnabled = false;
  sctx.clearRect(0, 0, canvasW, canvasH);
  sctx.drawImage(img, 0, 0, scaledW, scaledH);
  sctx.drawImage(scratch, 0, 0, scaledW, scaledH, 0, 0, canvasW, canvasH);

  // Keep the pixel layer ONLY inside the spot rectangles
  sctx.globalCompositeOperation = "destination-in";
  sctx.fillStyle = "#000";
  sctx.beginPath();
  for (const s of spots) {
    sctx.rect(s.x * canvasW, s.y * canvasH, s.w * canvasW, s.h * canvasH);
  }
  sctx.fill();
  sctx.globalCompositeOperation = "source-over";

  // Composite the spotted pixel layer over the crisp base
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(scratch, 0, 0);
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

      // ring
      centerX = 0.5,
      centerY = 0.5,
      radiusX = 0.26,
      radiusY = 0.34,
      feather = 0.4,

      // spots
      spots = [],
    }: UsePixelateOptions = {}
): React.RefObject<HTMLCanvasElement | null> {
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
      // Cap the canvas buffer to roughly what the display can actually show.
      // The source scans are ~1444×2178 but the canvas is only ~440–660 CSS px
      // wide, so pixelating at full source resolution is wasted work on every
      // frame. Scale the buffer down (aspect ratio preserved, never upscaling)
      // toward the on-screen size × devicePixelRatio, with headroom for
      // object-fit: cover and any CSS zoom transform.
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const displayLong = Math.max(rect.width, rect.height);
      const naturalLong = Math.max(img.naturalWidth, img.naturalHeight, 1);
      const cap = displayLong > 0 ? displayLong * dpr * 1.5 : naturalLong;
      const bufferScale = Math.min(1, cap / naturalLong);

      canvas.width = Math.max(1, Math.round(img.naturalWidth * bufferScale));
      canvas.height = Math.max(1, Math.round(img.naturalHeight * bufferScale));

      // pixelSize is expressed in *buffer* pixels, so scale it by the same
      // factor — this keeps the number of mosaic blocks across the image (and
      // therefore the visual result) identical while the buffer gets cheaper.
      const scalePixel = (pixelSize: number): number =>
          Math.max(1, Math.round(pixelSize * bufferScale));

      const startTime = performance.now();

      // ── RING loop (crisp centre, oscillating mosaic surround) ──
      if (mode === "ring") {
        const scratch = document.createElement("canvas");
        scratch.width = canvas.width;
        scratch.height = canvas.height;

        const region: RingRegion = { centerX, centerY, radiusX, radiusY, feather };

        let lastPixel = -1;
        const ring = (now: number): void => {
          const elapsed = now - startTime;
          const cycleProgress = (elapsed % cycleDuration) / cycleDuration;
          const wave = sineOscillate(cycleProgress);
          const pixelSize = scalePixel(pixelMin + (pixelMax - pixelMin) * wave);

          // Only redraw when the rounded block size actually changes — over a
          // long cycle it holds each value for ~1s, so this skips ~99% of the
          // otherwise-identical full-canvas redraws.
          if (pixelSize !== lastPixel) {
            lastPixel = pixelSize;
            drawRing(ctx, scratch, img, pixelSize, canvas.width, canvas.height, region);
          }

          animationFrameId = requestAnimationFrame(ring);
        };

        animationFrameId = requestAnimationFrame(ring);
        return;
      }

      // ── SPOTS loop (crisp image, a few oscillating mosaic patches) ──
      if (mode === "spots") {
        const scratch = document.createElement("canvas");
        scratch.width = canvas.width;
        scratch.height = canvas.height;

        const spotList = spots;

        let lastPixel = -1;
        const spotsTick = (now: number): void => {
          const elapsed = now - startTime;
          const cycleProgress = (elapsed % cycleDuration) / cycleDuration;
          const wave = sineOscillate(cycleProgress);
          const pixelSize = scalePixel(pixelMin + (pixelMax - pixelMin) * wave);

          // Skip the redraw while the block size is unchanged (see ring loop).
          if (pixelSize !== lastPixel) {
            lastPixel = pixelSize;
            drawSpots(ctx, scratch, img, pixelSize, canvas.width, canvas.height, spotList);
          }

          animationFrameId = requestAnimationFrame(spotsTick);
        };

        animationFrameId = requestAnimationFrame(spotsTick);
        return;
      }

      // ── OSCILLATE loop ──────────────────────
      if (mode === "oscillate") {
        let lastPixel = -1;
        const oscillate = (now: number): void => {
          const elapsed = now - startTime;

          // Progress within current cycle: 0 → 1, repeating
          const cycleProgress = (elapsed % cycleDuration) / cycleDuration;

          // Sine gives smooth 0→1→0 within each cycle
          const wave = sineOscillate(cycleProgress);

          // Map wave (0–1) to pixel range (pixelMin–pixelMax)
          const pixelSize = scalePixel(pixelMin + (pixelMax - pixelMin) * wave);

          // Skip the redraw while the block size is unchanged (see ring loop).
          if (pixelSize !== lastPixel) {
            lastPixel = pixelSize;
            drawPixelated(ctx, img, pixelSize, canvas.width, canvas.height);
          }

          animationFrameId = requestAnimationFrame(oscillate);
        };

        animationFrameId = requestAnimationFrame(oscillate);
        return;
      }

      // ── REVEAL (one-shot) ───────────────────
      let lastPixel = -1;
      const reveal = (now: number): void => {
        const elapsed = now - startTime;
        const rawProgress = Math.min(elapsed / duration, 1);
        const easedProgress = easing(rawProgress);

        const pixelSize = scalePixel(
            Math.max(endPixel, startPixel - (startPixel - endPixel) * easedProgress)
        );

        // Skip the redraw while the block size is unchanged (see ring loop).
        if (pixelSize !== lastPixel) {
          lastPixel = pixelSize;
          drawPixelated(ctx, img, pixelSize, canvas.width, canvas.height);
        }

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
  }, [src, mode, duration, startPixel, endPixel, easing, onComplete, pixelMin, pixelMax, cycleDuration, centerX, centerY, radiusX, radiusY, feather, spots]);

  return canvasRef;
}

export type { UsePixelateOptions, PixelateMode };