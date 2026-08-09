import React, {type CSSProperties } from "react";
import { usePixelate } from "../../hooks/usePixelate.ts";
import type { PixelateMode } from "../../hooks/usePixelate.ts";

/** A rectangular patch, as fractions (0–1) of the canvas. */
interface Spot {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface PixelateImageProps {
  /** Image source — imported asset or URL string */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Display width. Default: "100%" */
  width?: CSSProperties["width"];
  /** Display height. Default: "auto" */
  height?: CSSProperties["height"];

  /**
   * "reveal"    — animates from pixelated → crisp once. (default)
   * "oscillate" — bounces between pixelMin ↔ pixelMax forever.
   * "ring"      — only the area outside a central ellipse is pixelated.
   */
  mode?: PixelateMode;

  // ── reveal props ────────────────────────────
  /** Duration of the reveal in ms. Default: 2000 */
  duration?: number;
  /** Starting pixel block size for reveal. Default: 40 */
  startPixel?: number;
  /** Ending pixel block size for reveal. 1 = fully crisp. Default: 1 */
  endPixel?: number;
  /** Called when reveal finishes */
  onComplete?: () => void;

  // ── oscillate props ─────────────────────────
  /**
   * Minimum pixel size — the "least pixelated" state.
   * Lower = closer to crisp. Default: 4
   */
  pixelMin?: number;
  /**
   * Maximum pixel size — the "most pixelated" state.
   * Higher = chunkier blocks. Default: 20
   */
  pixelMax?: number;
  /**
   * How long one full oscillation cycle takes in ms.
   * Default: 3000 (3 seconds per full bounce)
   */
  cycleDuration?: number;

  // ── ring props ──────────────────────────────
  /** Horizontal centre of the crisp ellipse (fraction of width). Default: 0.5 */
  centerX?: number;
  /** Vertical centre of the crisp ellipse (fraction of height). Default: 0.5 */
  centerY?: number;
  /** Horizontal radius of the crisp ellipse (fraction of width). Default: 0.26 */
  radiusX?: number;
  /** Vertical radius of the crisp ellipse (fraction of height). Default: 0.34 */
  radiusY?: number;
  /** Softness of the crisp→pixelated transition (fraction of radius). Default: 0.4 */
  feather?: number;

  // ── spots props ─────────────────────────────
  /** Rectangular patches (fractions of canvas) to pixelate in "spots" mode. */
  spots?: Spot[];

  // ── style ───────────────────────────────────
  className?: string;
  style?: CSSProperties;
}

/**
 * PixelateImage
 *
 * @example — oscillating hero background (stays pixelated, bounces between sizes)
 * <PixelateImage
 *   src={background}
 *   alt="Hero background"
 *   width="100%"
 *   height="100vh"
 *   mode="oscillate"
 *   pixelMin={4}
 *   pixelMax={16}
 *   cycleDuration={4000}
 *   style={{ objectFit: "cover" }}
 * />
 *
 * @example — reveal on mount (original behaviour)
 * <PixelateImage
 *   src={photo}
 *   alt="My photo"
 *   width="600px"
 *   height="400px"
 *   mode="reveal"
 *   duration={2000}
 *   startPixel={40}
 * />
 */
const PixelateImage: React.FC<PixelateImageProps> = ({
                                                       src,
                                                       alt,
                                                       width = "100%",
                                                       height = "auto",
                                                       mode = "reveal",

                                                       // reveal
                                                       duration = 2000,
                                                       startPixel = 40,
                                                       endPixel = 1,
                                                       onComplete,

                                                       // oscillate
                                                       pixelMin = 4,
                                                       pixelMax = 10,
                                                       cycleDuration = 3000,

                                                       // ring
                                                       centerX = 0.5,
                                                       centerY = 0.5,
                                                       radiusX = 0.26,
                                                       radiusY = 0.34,
                                                       feather = 0.4,

                                                       // spots
                                                       spots,

                                                       // style
                                                       className,
                                                       style,
                                                     }) => {
  const canvasRef = usePixelate(src, {
    mode,
    duration,
    startPixel,
    endPixel,
    onComplete,
    pixelMin,
    pixelMax,
    cycleDuration,
    centerX,
    centerY,
    radiusX,
    radiusY,
    feather,
    spots,
  });

  return (
      <canvas
          ref={canvasRef}
          role="img"
          aria-label={alt}
          className={className}
          style={{
            width,
            height,
            display: "block",
            ...style,
          }}
      />
  );
};

export default PixelateImage;