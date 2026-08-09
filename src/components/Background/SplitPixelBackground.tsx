import React from "react";
import styled from "styled-components";
import PixelateImage from "./PixelateImage.tsx";

/**
 * The signature two-photo backdrop shared by the enter (/) page and the main
 * portfolio page: two photos side by side, each filling half the width, with a
 * few slow-breathing pixelated "spots" scattered across each half so the two
 * backgrounds read identically.
 */
const SplitBackground = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  z-index: 0;

  /* Each half occupies 50% of the width at full height. object-fit: fill
     stretches each photo to fill its half completely — no black gaps and no
     cropping, at the cost of slight aspect-ratio distortion. */
  & > * {
    width: 50%;
    height: 100%;
    object-fit: fill;
  }
`;

// Scattered patches (fractions of each half's canvas) that get pixelated —
// everything else stays crisp. Module-level constants so their references are
// stable across renders (usePixelate keys its animation off these).
const LEFT_SPOTS = [
  { x: 0.12, y: 0.28, w: 0.2, h: 0.24 },
  { x: 0.34, y: 0.58, w: 0.12, h: 0.13 },
  { x: 0.7, y: 0.04, w: 0.18, h: 0.09 },
];
const RIGHT_SPOTS = [
  { x: 0.62, y: 0.1, w: 0.16, h: 0.17 },
  { x: 0.4, y: 0.62, w: 0.12, h: 0.12 },
  { x: 0.12, y: 0.88, w: 0.18, h: 0.09 },
];

export interface SplitPixelBackgroundProps {
  photoLeft: string;
  photoRight: string;
  altLeft?: string;
  altRight?: string;
  /** Height of each half. "100%" fills the parent (default); pass "100vh" to
   *  pin to the viewport on a full-screen section. */
  halfHeight?: string;
}

export const SplitPixelBackground: React.FC<SplitPixelBackgroundProps> = ({
  photoLeft,
  photoRight,
  altLeft = "",
  altRight = "",
  halfHeight = "100%",
}) => (
  <SplitBackground aria-hidden="true">
    <PixelateImage
      src={photoLeft}
      alt={altLeft}
      width="50%"
      height={halfHeight}
      mode="spots"
      spots={LEFT_SPOTS}
      pixelMin={74}
      pixelMax={85}
      cycleDuration={40000}
      style={{ objectFit: "fill" }}
    />
    <PixelateImage
      src={photoRight}
      alt={altRight}
      width="50%"
      height={halfHeight}
      mode="spots"
      spots={RIGHT_SPOTS}
      pixelMin={74}
      pixelMax={85}
      cycleDuration={40000}
      style={{ objectFit: "fill" }}
    />
  </SplitBackground>
);

export default SplitPixelBackground;
