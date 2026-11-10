import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';

// A line of text that retypes itself when the pointer comes over it: the line
// blanks, then each character comes back under a block cursor, flickering
// through a few random letters and symbols before settling. After effect 1 of
// Codrops' Line Text Hover Animations (MIT,
// https://github.com/codrops/LineTextHoverAnimations), on requestAnimationFrame
// rather than GSAP and SplitType.
//
// A line inside an element marked data-scramble-group retypes when the pointer
// enters that element instead, alongside the group's other lines, the way the
// demo's list rows retype all their columns at once.
//
// It's fun once or twice and tiresome after, so each line retypes at most
// twice: once as its page first opens (see ScrambleOpening), once more on
// hover, and then it stays put.

const LETTERS_AND_SYMBOLS = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*-_+=;:<>,';
// The demo's timings: characters start 70ms apart, then show four random
// glyphs, each fading in over 30ms and held for 40ms.
const STEP_MS = 70;
const FLICKERS = 4;
const FADE_MS = 30;
const FLICKER_MS = FADE_MS + 40;
const SETTLE_MS = FLICKERS * FLICKER_MS;
// At 70ms a character, a long sentence would take half a minute to retype;
// tighten the stagger so any line is back within this.
const LONGEST_MS = 1200;
const MAX_PLAYS = 2;

// True once the page holding the lines has been opened.
const OpeningContext = createContext(false);
export const ScrambleOpening: React.FC<{ opened: boolean; children: React.ReactNode }> = ({ opened, children }) => (
  <OpeningContext value={opened}>{children}</OpeningContext>
);

const isSpace = (glyph: string): boolean => /\s/.test(glyph);
const randomGlyph = (): string => LETTERS_AND_SYMBOLS[Math.floor(Math.random() * LETTERS_AND_SYMBOLS.length)];

export const ScrambleText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const line = useRef<HTMLSpanElement>(null);
  // 0 at rest; each hover bumps it, restarting the animation from the top.
  const [run, setRun] = useState(0);
  const opened = useContext(OpeningContext);
  const plays = useRef(0);

  useEffect(() => {
    const el = line.current;
    if (!el) return;
    const target = el.closest<HTMLElement>('[data-scramble-group]') ?? el;
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const play = (): void => {
      if (calm.matches || plays.current >= MAX_PLAYS) return;
      plays.current += 1;
      setRun(n => n + 1);
    };
    // the opening retype waits a frame for the page to show
    const opening = opened && plays.current === 0 ? requestAnimationFrame(play) : 0;
    const onEnter = (event: PointerEvent): void => {
      if (event.pointerType !== 'touch') play();
    };
    // Touch has no hover, so a tap retypes; a touch that turns into a scroll
    // ends in pointercancel rather than pointerup, so scrolling past doesn't.
    const onTap = (event: PointerEvent): void => {
      if (event.pointerType === 'touch') play();
    };
    target.addEventListener('pointerenter', onEnter);
    target.addEventListener('pointerup', onTap);
    return () => {
      cancelAnimationFrame(opening);
      target.removeEventListener('pointerenter', onEnter);
      target.removeEventListener('pointerup', onTap);
    };
  }, [opened]);

  // Drive the split characters directly; React only renders them.
  useLayoutEffect(() => {
    if (!run || !line.current) return;
    const chars = Array.from(line.current.querySelectorAll<HTMLElement>('.win95-scramble-char'));
    // from the text, not the DOM: a re-hover mid-flicker finds glyphs scrambled
    const originals = Array.from(text).filter(glyph => !isSpace(glyph));
    const step = Math.min(STEP_MS, LONGEST_MS / Math.max(1, chars.length));
    const shown = chars.map(() => -1);
    const start = performance.now();
    let frame = 0;
    const tick = (now: number): void => {
      let busy = false;
      chars.forEach((char, i) => {
        const t = now - start - (i + 1) * step;
        if (t >= SETTLE_MS) {
          if (shown[i] < FLICKERS) {
            shown[i] = FLICKERS;
            char.textContent = originals[i];
            char.style.opacity = '';
            char.style.setProperty('--opa', '0');
          }
          return;
        }
        busy = true;
        if (t < 0) {
          char.style.opacity = '0';
          return;
        }
        const flicker = Math.floor(t / FLICKER_MS);
        if (flicker !== shown[i]) {
          shown[i] = flicker;
          char.textContent = randomGlyph();
          // the cursor block shows for the first flicker only
          char.style.setProperty('--opa', flicker === 0 ? '1' : '0');
        }
        const fade = Math.min(1, (t - flicker * FLICKER_MS) / FADE_MS);
        char.style.opacity = String(1 - (1 - fade) ** 2);
      });
      if (busy) frame = requestAnimationFrame(tick);
      else setRun(0);
    };
    // First frame now, before paint, so the line never flashes whole.
    tick(start);
    return () => cancelAnimationFrame(frame);
  }, [run, text]);

  if (!run) {
    return <span ref={line} className={className}>{text}</span>;
  }
  // While retyping, the scrambled characters are hidden from assistive tech
  // and a plain copy stands in for them.
  return (
    <span ref={line} className={className}>
      <span className="win95-scramble-copy">{text}</span>
      <span aria-hidden="true">
        {Array.from(text).map((glyph, i) =>
          isSpace(glyph) ? glyph : <span key={i} className="win95-scramble-char">{glyph}</span>,
        )}
      </span>
    </span>
  );
};
