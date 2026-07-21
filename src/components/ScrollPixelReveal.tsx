import React, { CSSProperties, useState } from "react";
import { useInView } from "react-intersection-observer";
import PixelateImage from "./PixelateImage";

interface ScrollPixelRevealProps {
  /** Image source — use an imported asset or a URL string */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Display width of the image (CSS value e.g. "600px" or "100%") */
  width?: CSSProperties["width"];
  /** Display height of the image (CSS value e.g. "400px") */
  height?: CSSProperties["height"];
  /** Duration of the pixelate → sharp animation in ms. Default: 2000 */
  duration?: number;
  /** Starting pixel block size. Higher = chunkier. Default: 40 */
  startPixel?: number;
  /**
   * How much of the image must be visible before the animation triggers.
   * 0 = as soon as any part enters the viewport.
   * 1 = only when fully visible.
   * Default: 0.3 (30% visible)
   */
  threshold?: number;
  /** Whether to re-trigger the animation every time it scrolls into view. Default: false */
  retrigger?: boolean;
  /** Optional className applied to the outer wrapper div */
  className?: string;
  /** Optional inline styles for the outer wrapper div */
  style?: CSSProperties;
  /** Placeholder shown before the image scrolls into view */
  placeholder?: React.ReactNode;
}

/**
 * ScrollPixelReveal
 *
 * Wraps PixelateImage and fires the animation only when the image
 * scrolls into the viewport. Perfect for gallery reveals on your
 * pottery, knitting, ceramics, and travel pages.
 *
 * Requires: npm install react-intersection-observer
 *
 * @example
 * <ScrollPixelReveal
 *   src={potteryPhoto}
 *   alt="Ceramic bowl"
 *   width="100%"
 *   height="400px"
 *   duration={2000}
 *   threshold={0.3}
 * />
 */
const ScrollPixelReveal: React.FC<ScrollPixelRevealProps> = ({
  src,
  alt,
  width = "100%",
  height = "400px",
  duration = 2000,
  startPixel = 40,
  threshold = 0.3,
  retrigger = false,
  className,
  style,
  placeholder,
}) => {
  const [hasTriggered, setHasTriggered] = useState<boolean>(false);
  const [key, setKey] = useState<number>(0); // increment to re-mount & restart animation

  const { ref } = useInView({
    threshold,
    onChange: (inView: boolean) => {
      if (inView && (!hasTriggered || retrigger)) {
        setHasTriggered(true);
        if (retrigger) {
          setKey((prev) => prev + 1); // force re-mount to restart animation
        }
      }
    },
  });

  return (
    <div
      ref={ref}
      className={className}
      style={{
        width,
        height,
        overflow: "hidden",
        ...style,
      }}
    >
      {hasTriggered ? (
        <PixelateImage
          key={key}
          src={src}
          alt={alt}
          width={width}
          height={height}
          duration={duration}
          startPixel={startPixel}
        />
      ) : (
        placeholder ?? (
          // Default placeholder: a soft teal shimmer matching Frutiger Aero palette
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #a8e6f0 0%, #d4f5e0 100%)",
              borderRadius: "inherit",
            }}
          />
        )
      )}
    </div>
  );
};

export default ScrollPixelReveal;
