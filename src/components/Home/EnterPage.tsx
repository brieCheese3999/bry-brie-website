import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import PixelateImage from "../Background/PixelateImage.tsx";
import photo1 from "../../assets/photos/HAWAII15.jpeg";
import photo2 from "../../assets/photos/HAWAII_4.jpg";
import headshot from "../../assets/photos/HAWAII11.jpeg";
import frame from "../../assets/frames/frame044.svg";
import cornerOrnament from "../../assets/frames/067.svg";
import trim from "../../assets/frames/044-line.svg";
import trimSides from "../../assets/frames/044-line-sides.svg";
import cornerSparkle from "../../assets/frames/sparkle.svg";
import cornerSparkleSmall from "../../assets/frames/sparkle-small.svg";
import roseAtelierWoff2 from "../../assets/font/the_rose_atelier-webfont.woff2";
import roseAtelierWoff from "../../assets/font/the_rose_atelier-webfont.woff";
import roseAtelierBoldWoff2 from "../../assets/font/the_rose_atelier_bold-webfont.woff2";
import roseAtelierBoldWoff from "../../assets/font/the_rose_atelier_bold-webfont.woff";

const EnterFonts = createGlobalStyle`
  @font-face {
    font-family: 'The Rose Atelier';
    src: url('${roseAtelierWoff2}') format('woff2'),
         url('${roseAtelierWoff}') format('woff');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'The Rose Atelier';
    src: url('${roseAtelierBoldWoff2}') format('woff2'),
         url('${roseAtelierBoldWoff}') format('woff');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }
`;

const OPENING = {
  left: "22.5%",
  top: "9%",
  width: "55%",
  height: "78%",
};

const Section = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #0f0d0c;
`;

const SheerBox = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 95%;
  height: 90%;
  background: rgba(24, 17, 23, 0.20); /* #181117, sheer */
  border-radius: 50%;
  pointer-events: none;
`;

const SheerBox2 = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  height: 80%;
  background: rgba(24, 17, 23, 0.30); /* #181117, sheer */
  border-radius: 50%;
  pointer-events: none;
`;

const CORNER_SIZE = "min(3vw, 50px)";

// How far each edge trim's end sits from the page corner. The corner sparkle
// cluster reaches ~2.6x CORNER_SIZE in from the corner, so insetting the edges
// a bit past that leaves a small breathing gap between each trim end and the
// sparkle (they no longer touch). Scales with the page like CORNER_SIZE.
const EDGE_INSET_TB = "min(5vw, 95px)";
const EDGE_INSET_LR = "min(4vw, 90px)";

/* A lace edge made of two tileable trims butted flat-end to flat-end so they
   read as one continuous line spanning one edge, ending just shy of the two
   corner groups on that edge. The horizontal bar is rotated 90deg for the
   left/right edges; its length there is the viewport height minus the corners. */
const Trim = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  z-index: 4;
  pointer-events: none;

  & .trim {
    display: block;
    width: 50%;
    height: auto;
    padding: 0;
    margin: 0;
  }
  /* The tile has a soft round-capped end on its LEFT and a flat end on its
     right. Mirror the second tile so a rounded end faces each outer edge while
     both flat ends still meet flush at the center seam. */
  & .trim:last-child {
    transform: scaleX(-1);
  }

  &.top {
    top: 0;
    left: 50%;
    width: calc(100% - 2 * ${EDGE_INSET_TB});
    transform: translateX(-50%) rotate(180deg);
  }
  &.bottom {
    bottom: 0;
    left: 50%;
    width: calc(100% - 2 * ${EDGE_INSET_TB});
    transform: translateX(-50%);
  }
  /* The side trims tile the lace as a repeating background so the strip's
     THICKNESS is set independently of its length. Thickness uses the same
     width-based formula as a top/bottom tile (0.37 tile width * 0.072 aspect
     ratio => 0.0324 * usable width), so all four edges match and scale together
     as the page WIDTH changes. Length still follows viewport height. */
  &.left,
  &.right {
    height: calc(0.02664 * (100vw - 2 * ${CORNER_SIZE}));
    background-image: url("${trimSides}");
    background-repeat: repeat-x;
    background-position: center;
    background-size: auto 100%;
  }
  &.left {
    top: 50%;
    /* Offset by half the strip thickness so the strip's outer edge sits flush
       to the page edge (its center inset = thickness/2 = top strip's center). */
    left: calc(0.0162 * (100vw - 2 * ${CORNER_SIZE}));
    width: calc(100vh - 2 * ${EDGE_INSET_LR});
    transform-origin: left center;
    transform: translateY(-50%) rotate(90deg) translateX(-50%);
  }
  &.right {
    top: 50%;
    right: calc(0.0162 * (100vw - 2 * ${CORNER_SIZE}));
    width: calc(100vh - 2 * ${EDGE_INSET_LR});
    transform-origin: right center;
    transform: translateY(-50%) rotate(-90deg) translateX(50%);
  }
`;

const CornerGroup = styled.div`
  position: absolute;
  width: ${CORNER_SIZE};
  aspect-ratio: 336 / 272;
  /* Above the edge trims (z-index 4) so each corner sparkle sits on top as the
     medallion that caps where the two edges meet — connected frame, sparkle
     stays fully visible. */
  z-index: 5;
  pointer-events: none;

  /* The sprig fills the group box. */
  & .sprig {
    display: block;
    width: 100%;
    height: 100%;
  }

  /* Stacked accents trailing from the sprig's tail tip (bottom-center of the art)
     toward the center: first the sparkle, then the fleur at the sparkle's tip. */
  & .tail {
    position: absolute;
    left: 50%;
    top: 100%;
    transform: translate(-50%, -8%);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  & .tail img {
    display: block;
    height: auto;
  }
  /* The two big sparkles + the flanking small pair, grouped so the small
     "cross" stays locked to the sparkles' meeting point even as other
     elements change the tail's overall height. */
  & .burst {
    position: relative;
    width: 82%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  & .burst .s1,
  & .burst .s2 {
    position: relative;
    width: 140%;
    display: flex;
    justify-content: center;
  }
  & .burst .s2 {
    margin-top: -6%;
  }
  & .burst .sparkle {
    width: 100%;
  }
  & .burst .sparkle.second {
    transform: rotate(180deg);
  }

  /* A medallion on each side of sparkle 2. */
  & .burst .medallion {
    position: absolute;
    top: 50%;
    width: 70%;
    transform: translateY(-50%) scaleY(-1);
  }
  & .burst .medallion.left {
    right: 30%;
    margin-right: 130%;
    margin-top: -20%;
    rotate: 45deg;
  }
  & .burst .medallion.right {
    left: 30%;
    margin-left: 130%;
    margin-top: -20%;
    rotate: -45deg;
  }

  & .burst .ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%;
    transform: translate(-50%, -50%);
  }

  /* Two small sparkles flanking the point where the two big sparkles meet
     (the burst's vertical center), pointing outward to form a little cross. */
  & .burst .side {
    position: absolute;
    top: 80%;
    width: 100%;
    transform: translateY(-50%);
  }
  & .burst .side img {
    display: block;
    width: 100%;
    height: auto;
  }
  & .burst .side.left {
    right: 50%;
    margin-right: 6%;
  }
  & .burst .side.left img {
    transform: rotate(90deg);
  }
  & .burst .side.right {
    left: 50%;
    margin-left: 6%;
  }
  & .burst .side.right img {
    transform: rotate(-90deg);
  }

  &.top-left {
    top: 0;
    left: 0;
    transform: rotate(-45deg);
  }
  &.top-right {
    top: 0;
    right: 0;
    transform: rotate(45deg);
  }
  &.bottom-left {
    bottom: 0;
    left: 0;
    transform: rotate(-135deg);
  }
  &.bottom-right {
    bottom: 0;
    right: 0;
    transform: rotate(135deg);
  }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3vh;
`;

const FrameButton = styled.button`
  position: relative;
  aspect-ratio: 1 / 1;
  width: min(94vw, 560px);
  height: auto;
  max-height: 96vh;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.3s ease, filter 0.3s ease;
  filter: drop-shadow(0 18px 40px rgba(0, 0, 0, 0.45));

  &:hover,
  &:focus-visible {
    transform: translateY(-4px) scale(1.015);
  }

  &:focus-visible {
    outline-offset: 10px;
    border-radius: 12px;
  }
`;

// How much to zoom the framed photo in. 1 = no zoom (fills the opening exactly);
// higher = tighter crop on the subject. The clip stays on the wrapper, so the
// visible ellipse doesn't change size — only the photo inside it scales up.
const PORTRAIT_ZOOM = 1.5;

// Fixed-size, ellipse-clipped window the portrait lives in. Sized/positioned to
// the frame opening; clip-path (which also clips descendants) keeps the visible
// oval constant while the canvas inside scales up to zoom.
const PortraitFrame = styled.div`
  position: absolute;
  left: ${OPENING.left};
  top: ${OPENING.top};
  width: ${OPENING.width};
  height: ${OPENING.height};
  clip-path: ellipse(50% 50% at 50% 50%);
  z-index: 0;
`;

// The portrait is a PixelateImage (canvas) rather than a plain <img> so a few
// patches of it can pixelate/breathe like the split background. It fills the
// clipped frame and scales up for the zoom; object-fit/object-position work on
// the canvas just like an <img>.
const Portrait = styled(PixelateImage)`
  object-fit: cover;
  object-position: center 20%;
  transform: scale(${PORTRAIT_ZOOM});
  transform-origin: center 30%;
`;

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

const FrameArt = styled.img`
  position: absolute;
  inset: 0;
  left: -7.5%;
  top: -25%;
  width: 115%;
  height: 150%;
  z-index: 1;
  pointer-events: none;
  /* Clip the beige PNG rectangle to a tight ellipse hugging the ornate
     flourishes, leaving only a thin beige rim instead of a wide oval. */
  clip-path: ellipse(38% 39% at 50% 50%);
`;

const EnterPage: React.FC = () => {
  const navigate = useNavigate();
  const handleEnter = () => navigate("/about");

  // A few scattered patches (fractions of the photo) that get pixelated —
  // everything else stays crisp. Placed around where the frame sits so they
  // read as little mosaic accents, not a full-image effect.
  // Spots are fractions of each half's canvas, so they're spread across
  // each 50%-wide panel independently.
  const leftSpots = useMemo(
    () => [
      { x: 0.12, y: 0.28, w: 0.20, h: 0.24 },
      { x: 0.34, y: 0.58, w: 0.12, h: 0.13 },
      { x: 0.7, y: 0.04, w: 0.18, h: 0.09 },
    ],
    []
  );
  const rightSpots = useMemo(
    () => [
      { x: 0.62, y: 0.1, w: 0.16, h: 0.17 },
      { x: 0.4, y: 0.62, w: 0.12, h: 0.12 },
      { x: 0.12, y: 0.88, w: 0.18, h: 0.09 },
    ],
    []
  );

  // Patches of the headshot (fractions of the 1200×1600 image) that pixelate.
  // Kept to the hair/edges and lower shirt so her face stays crisp; the frame's
  // ellipse crop + object-position hide anything below ~y 0.6.
  const portraitSpots = useMemo(
    () => [
      { x: 0.20, y: 0.42, w: 0.07, h: 0.07 },
      { x: 0.20, y: 0.72, w: 0.07, h: 0.07 },
      { x: 0.70, y: 0.62, w: 0.06, h: 0.06 },
    ],
    []
  );

  return (
    <Section>
      <EnterFonts />

      <SplitBackground aria-hidden="true">
        <PixelateImage
          src={photo1}
          alt="Bryanna holding Poppi the cat"
          width="50%"
          height="100vh"
          mode="spots"
          spots={leftSpots}
          pixelMin={74}
          pixelMax={85}
          cycleDuration={40000}
          style={{ objectFit: "fill" }}
        />
        <PixelateImage
          src={photo2}
          alt="Hawaii"
          width="50%"
          height="100vh"
          mode="spots"
          spots={rightSpots}
          pixelMin={74}
          pixelMax={85}
          cycleDuration={40000}
          style={{ objectFit: "fill" }}
        />
      </SplitBackground>
      <SheerBox aria-hidden="true" />
      <SheerBox2 aria-hidden="true" />

      {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map(
        (corner) => (
          <CornerGroup key={corner} className={corner} aria-hidden="true">
            <img className="sprig" src={cornerOrnament} alt="" />
            <span className="tail">
              <span className="burst">
                <span className="s1">
                  <img className="sparkle" src={cornerSparkle} alt="" />
                </span>
                <span className="side left">
                  <img src={cornerSparkleSmall} alt="" />
                </span>
                <span className="side right">
                  <img src={cornerSparkleSmall} alt="" />
                </span>
              </span>
            </span>
          </CornerGroup>
        )
      )}
      {(["top", "bottom"] as const).map((side) => (
        <Trim key={side} className={side} aria-hidden="true">
          <img className="trim" src={trim} alt="" />
          <img className="trim" src={trim} alt="" />
        </Trim>
      ))}
      {(["right", "left"] as const).map((side) => (
        <Trim key={side} className={side} aria-hidden="true" />
      ))}
      <Overlay>
        <FrameButton onClick={handleEnter} aria-label="Enter Bryanna's portfolio">
          <PortraitFrame>
            <Portrait
              src={headshot}
              alt="Bryanna"
              width="100%"
              height="100%"
              mode="spots"
              spots={portraitSpots}
              pixelMin={74}
              pixelMax={85}
              cycleDuration={40000}
            />
          </PortraitFrame>
          <FrameArt src={frame} alt="" />
        </FrameButton>
      </Overlay>
    </Section>
  );
};

export default EnterPage;
