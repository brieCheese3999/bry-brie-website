import React, { CSSProperties } from "react";
import { usePixelate } from "../hooks/usePixelate";
import type { PixelateMode } from  "../hooks/usePixelate";

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
                                                       pixelMax = 20,
                                                       cycleDuration = 3000,

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