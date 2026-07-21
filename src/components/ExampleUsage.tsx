/**
 * ExampleUsage.tsx
 *
 * Shows all three ways to use the pixelate effect.
 * Copy the patterns you need into your actual pages.
 */

import React from "react";
import PixelateImage from "./PixelateImage";
import ScrollPixelReveal from "./ScrollPixelReveal";
import { usePixelate } from "../hooks/usePixelate.ts";

// --- Example 1: Direct import (recommended for local assets) ---
import potteryPhoto from "../assets/photos/HAWAII_1.jpg";
import ceramicsPhoto from "../assets/photos/HAWAII_2.jpg";
import travelPhoto from "../assets/photos/HAWAII_3.jpg";

// ─────────────────────────────────────────────
// Example A — Simple drop-in component
// Plays animation immediately on mount
// ─────────────────────────────────────────────
export const SimpleExample: React.FC = () => (
  <PixelateImage
    src={potteryPhoto}
    alt="A ceramic bowl I made"
    width="300px"
    height="400px"
    duration={8000}     // 2 seconds
    startPixel={80}     // starts very blocky
    onComplete={() => console.log("Reveal complete!")}
  />
);

// ─────────────────────────────────────────────
// Example B — Scroll-triggered reveal
// Best for gallery pages — each image reveals as it enters the viewport
// ─────────────────────────────────────────────
export const GalleryExample: React.FC = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
    <ScrollPixelReveal
      src={potteryPhoto}
      alt="Ceramic bowl"
      width="100%"
      height="300px"
      duration={12000}
      startPixel={88}
      threshold={0.2}   // triggers when 20% visible
    />
    <ScrollPixelReveal
      src={ceramicsPhoto}
      alt="Ceramics piece"
      width="100%"
      height="300px"
      duration={12000}
      startPixel={88}
    />
    <ScrollPixelReveal
      src={travelPhoto}
      alt="Travel photo"
      width="100%"
      height="300px"
      duration={12000}
      startPixel={88}
    />
  </div>
);

// ─────────────────────────────────────────────
// Example C — Using the raw hook directly
// Use this when you need full control over the canvas element
// (e.g. adding click handlers, custom CSS, etc.)
// ─────────────────────────────────────────────
export const RawHookExample: React.FC = () => {
  const canvasRef = usePixelate(potteryPhoto, {
    duration: 3000,
    startPixel: 64,
    endPixel: 1,
    onComplete: () => console.log("Done!"),
  });

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="A pottery piece"
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(77, 184, 216, 0.25)", // Aero teal glow
        cursor: "pointer",
      }}
    />
  );
};

// ─────────────────────────────────────────────
// Example D — Hero section with URL (no import needed)
// ─────────────────────────────────────────────
export const HeroExample: React.FC = () => (
  <section style={{ position: "relative", width: "100%", height: "100vh" }}>
    <PixelateImage
      src={travelPhoto}
      alt="Hero background"
      width="100%"
      height="100vh"
      duration={3000}
      startPixel={80}   // very chunky start for dramatic hero effect
      style={{ objectFit: "cover" }}
    />
    {/* Overlay your text on top */}
    <div style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(168, 230, 240, 0.15)",
    }}>
      <h1 style={{ color: "white", fontSize: "4rem" }}>Your Name</h1>
    </div>
  </section>
);
