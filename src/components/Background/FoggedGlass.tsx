import React, { useEffect, useRef } from "react";
import styled from "styled-components";

/**
 * Steamed-up glass over the enter page's two photos. The photos sit side by
 * side, each stretched to fill half the width like the split backdrop; a
 * blurred, beaded mist covers them and the pointer (or a finger) wipes it
 * clear. Wiped patches shed a few running drops and slowly fog back over.
 * Optional phases (text, heart shape) are drawn into the fog in sequence,
 * each refogging before the next begins.
 */

const Glass = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  opacity: 0;
  transition: opacity 0.6s ease;

  &[data-ready="true"] {
    opacity: 1;
  }
`;

const Layer = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
`;

// A wipe stays clear this long, then the mist creeps back over REFOG ms.
const CLEAR_FOR = 2700;
const REFOG = 2400;
// Runs of water stay clear a little longer than the wipes they came from.
const STREAK_FOR = 4200;
const STREAK_FADE = 3600;
// Wipe radius and drop sizes are tuned on a 1512px-wide window.
const COMP_WIDTH = 1512;
const WIPE_RADIUS = 22;
const MASK_SCALE = 0.5;
const TAU = Math.PI * 2;

interface Stamp {
  x: number;
  y: number;
  r: number;
  t: number;
  clearFor?: number;
}

/** A point on the name's trail, d along the way the pen travels. */
interface Touch {
  x: number;
  y: number;
  d: number;
}

interface Drip {
  x: number;
  y0: number;
  y: number;
  r: number;
  v: number;
  go: number;
  reach: number;
  t: number;
  moved: number;
  stuck: boolean;
  done: boolean;
}

const clamp = (v: number, a = 0, b = 1): number => Math.min(b, Math.max(a, v));

const clearness = (age: number, hold: number, fade: number): number =>
  age < hold ? 1 : clamp(1 - (age - hold) / fade);

/** Small seeded generator, so the drops land in the same places every load. */
function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`[FoggedGlass] Failed to load image: ${src}`));
    img.src = src;
  });
}

/** A running drop: dark rim, bright lower lip, a glint. */
function makeDripBead(): HTMLCanvasElement {
  const c = makeCanvas(96, 96);
  const g = c.getContext("2d")!;
  const R = 48;
  let gr = g.createRadialGradient(R, R * 1.06, R * 0.2, R, R, R);
  gr.addColorStop(0, "rgba(0,0,0,0)");
  gr.addColorStop(0.6, "rgba(18,14,8,.06)");
  gr.addColorStop(0.88, "rgba(18,14,8,.5)");
  gr.addColorStop(1, "rgba(18,14,8,.3)");
  g.fillStyle = gr;
  g.beginPath();
  g.arc(R, R, R, 0, TAU);
  g.fill();
  gr = g.createRadialGradient(R, R * 1.5, 0, R, R * 1.5, R * 0.62);
  gr.addColorStop(0, "rgba(255,252,240,.5)");
  gr.addColorStop(1, "rgba(255,252,240,0)");
  g.save();
  g.beginPath();
  g.arc(R, R, R * 0.96, 0, TAU);
  g.clip();
  g.fillStyle = gr;
  g.fillRect(0, 0, 96, 96);
  g.restore();
  gr = g.createRadialGradient(R * 0.66, R * 0.58, 0, R * 0.66, R * 0.58, R * 0.2);
  gr.addColorStop(0, "rgba(255,255,255,.95)");
  gr.addColorStop(0.45, "rgba(255,255,255,.55)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 96, 96);
  return c;
}

/** A drop sitting in the mist: a pale, translucent bump. */
function makeMistBead(): HTMLCanvasElement {
  const c = makeCanvas(96, 96);
  const g = c.getContext("2d")!;
  const R = 48;
  let gr = g.createRadialGradient(R, R * 0.9, 0, R, R, R);
  gr.addColorStop(0, "rgba(236,232,222,.22)");
  gr.addColorStop(0.75, "rgba(236,232,222,.3)");
  gr.addColorStop(0.93, "rgba(60,52,40,.3)");
  gr.addColorStop(1, "rgba(60,52,40,0)");
  g.fillStyle = gr;
  g.beginPath();
  g.arc(R, R, R, 0, TAU);
  g.fill();
  gr = g.createRadialGradient(R, R * 1.45, 0, R, R * 1.45, R * 0.6);
  gr.addColorStop(0, "rgba(255,253,246,.45)");
  gr.addColorStop(1, "rgba(255,253,246,0)");
  g.save();
  g.beginPath();
  g.arc(R, R, R * 0.95, 0, TAU);
  g.clip();
  g.fillStyle = gr;
  g.fillRect(0, 0, 96, 96);
  g.restore();
  gr = g.createRadialGradient(R * 0.68, R * 0.6, 0, R * 0.68, R * 0.6, R * 0.22);
  gr.addColorStop(0, "rgba(255,255,255,.9)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 96, 96);
  return c;
}

/** Halve down, double back up: a cheap, smooth blur that works without ctx.filter. */
function blurred(src: HTMLCanvasElement, steps: number): HTMLCanvasElement {
  let cur = src;
  const chain: HTMLCanvasElement[] = [];
  for (let i = 0; i < steps; i++) {
    const next = makeCanvas(cur.width / 2, cur.height / 2);
    const g = next.getContext("2d")!;
    g.imageSmoothingQuality = "high";
    g.drawImage(cur, 0, 0, next.width, next.height);
    chain.push(next);
    cur = next;
  }
  for (let i = steps - 2; i >= -1; i--) {
    const target = i >= 0 ? chain[i] : makeCanvas(src.width, src.height);
    const g = target.getContext("2d")!;
    g.imageSmoothingQuality = "high";
    g.clearRect(0, 0, target.width, target.height);
    g.drawImage(cur, 0, 0, target.width, target.height);
    cur = target;
  }
  return cur;
}

// ───────────────── lettering ─────────────────

type Point = [number, number];

/** A word of lettering: its ink, and the pen strokes that write it, in order. */
interface Word {
  /** white ink on clear, in work pixels */
  ink: HTMLCanvasElement;
  /** pen paths over the ink, in the order they are written */
  strokes: Point[][];
  /** the inked extent inside `ink` */
  box: { x: number; y: number; w: number; h: number };
  baseline: number;
  /** for each column of `ink`, how far down its ink reaches (-1 where there is none) */
  bottoms: Int16Array;
}

// Letters sit a little closer than the font sets them, as a fraction of its size.
const TRACKING = -0.1;
// Letters are built at this size, then scaled to fit the window.
const WORK = 320;
// Thorn and hairline sizes were set against a 200px build; they grow with it.
const GRAIN = WORK / 200;
// How far either side of the pen path a stroke (and its thorns) can reach, in work px.
const REACH = 20 * GRAIN;
const fonts = new Map<string, Promise<string>>();

/** Loads the lettering font from its file and resolves to a usable font family. */
function loadFont(src: string): Promise<string> {
  const cached = fonts.get(src);
  if (cached) return cached;
  const family = `FoggedGlassLettering${fonts.size + 1}`;
  const ready = new Promise<string>(resolve => {
    const fallback = (): void => resolve("cursive");
    new FontFace(family, `url("${src}")`).load().then(face => {
      document.fonts.add(face);
      resolve(`"${family}"`);
    }, fallback);
    // never hold the page up for a font
    window.setTimeout(fallback, 3000);
  });
  fonts.set(src, ready);
  return ready;
}

/** Zhang–Suen thinning: wears the letters down to one-pixel centre lines. */
function thin(ink: Uint8Array, w: number, h: number): void {
  const gone: number[] = [];
  for (let changed = true; changed; ) {
    changed = false;
    for (let pass = 0; pass < 2; pass++) {
      gone.length = 0;
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const i = y * w + x;
          if (!ink[i]) continue;
          const p2 = ink[i - w], p3 = ink[i - w + 1], p4 = ink[i + 1], p5 = ink[i + w + 1];
          const p6 = ink[i + w], p7 = ink[i + w - 1], p8 = ink[i - 1], p9 = ink[i - w - 1];
          const b = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
          if (b < 2 || b > 6) continue;
          const ring = [p2, p3, p4, p5, p6, p7, p8, p9, p2];
          let a = 0;
          for (let k = 0; k < 8; k++) if (!ring[k] && ring[k + 1]) a++;
          if (a !== 1) continue;
          if (pass === 0 ? p2 * p4 * p6 || p4 * p6 * p8 : p2 * p4 * p8 || p2 * p6 * p8) continue;
          gone.push(i);
        }
      }
      for (const i of gone) ink[i] = 0;
      if (gone.length) changed = true;
    }
  }
}

/** Thins the ink and follows the centre lines into pen strokes, left to right. */
function trace(ink: Uint8Array, w: number, h: number): Point[][] {
  thin(ink, w, h);
  const around = [1, w + 1, w, w - 1, -1, -w - 1, -w, -w + 1];
  const next = (i: number): number[] => around.map(d => i + d).filter(j => ink[j]);
  const at = (i: number): Point => [i % w, Math.floor(i / w)];
  const seen = new Uint8Array(w * h);

  // walk from i, always taking the unvisited neighbour that keeps the heading
  const follow = (start: number): Point[] => {
    const path = [start];
    seen[start] = 1;
    let cur = start;
    let dx = 0;
    let dy = 0;
    for (;;) {
      let best = -1;
      let score = -Infinity;
      for (const j of next(cur)) {
        if (seen[j]) continue;
        const sx = (j % w) - (cur % w);
        const sy = Math.floor(j / w) - Math.floor(cur / w);
        const s = (sx * dx + sy * dy) / Math.hypot(sx, sy) + (sx && sy ? 0 : 0.01);
        if (s > score) {
          score = s;
          best = j;
        }
      }
      if (best < 0) break;
      dx = dx * 0.6 + ((best % w) - (cur % w)) * 0.4;
      dy = dy * 0.6 + (Math.floor(best / w) - Math.floor(cur / w)) * 0.4;
      seen[best] = 1;
      path.push(best);
      cur = best;
    }
    return path.map(at);
  };

  const cells: number[] = [];
  for (let i = 0; i < ink.length; i++) if (ink[i]) cells.push(i);

  // group the centre lines into separate marks, so an i's dot can be told apart
  const mark = new Int32Array(w * h).fill(-1);
  const members: number[][] = [];
  for (const i of cells) {
    if (mark[i] >= 0) continue;
    const group = [i];
    mark[i] = members.length;
    // the array iterator picks up cells pushed while it runs
    for (const cell of group) {
      for (const j of next(cell)) {
        if (mark[j] < 0) {
          mark[j] = members.length;
          group.push(j);
        }
      }
    }
    members.push(group);
  }

  // pen goes down at loose ends first, left to right; closed loops last
  const byX = (a: number, b: number): number => (a % w) - (b % w) || a - b;
  const ends = cells.filter(i => next(i).length === 1).sort(byX);
  const strokes: Point[][] = [];
  for (const i of [...ends, ...cells.sort(byX)]) {
    if (seen[i]) continue;
    const group = members[mark[i]];
    if (group.length < 14) {
      // a speck on its own is an i's dot: one touch of the pen
      for (const j of group) seen[j] = 1;
      const pts = group.map(at);
      strokes.push([[pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length]]);
      continue;
    }
    const raw = follow(i);
    // anything this short inside a bigger mark is thinning debris
    if (raw.length < 8) continue;
    // soften the pixel stair-steps, keep every other point
    const smooth = raw.map((_, k) => {
      let sx = 0;
      let sy = 0;
      let n = 0;
      for (let q = Math.max(0, k - 2); q <= Math.min(raw.length - 1, k + 2); q++) {
        sx += raw[q][0];
        sy += raw[q][1];
        n++;
      }
      return [sx / n, sy / n] as Point;
    });
    const path = smooth.filter((_, k) => k % 2 === 0 || k === smooth.length - 1);
    // write each stroke the way a hand would, broadly left to right
    if (path[0][0] - path[path.length - 1][0] > 12) path.reverse();
    strokes.push(path);
  }
  strokes.sort((a, b) => a[0][0] - b[0][0]);
  return strokes;
}

/**
 * Rose-thorns along the fuller strokes, so the lettering grows the same bramble
 * as the drawn B's stem. Hairlines stay bare.
 */
function thorns(g: CanvasRenderingContext2D, alpha: Uint8ClampedArray, w: number, h: number, strokes: Point[][], rand: () => number): void {
  const inside = (x: number, y: number): boolean => {
    const xi = Math.round(x);
    const yi = Math.round(y);
    return xi >= 0 && yi >= 0 && xi < w && yi < h && alpha[(yi * w + xi) * 4 + 3] > 120;
  };
  g.fillStyle = "#fff";
  let side = 1;
  for (const s of strokes) {
    let run = 0;
    let gap = (10 + rand() * 20) * GRAIN;
    for (let i = 2; i < s.length - 2; i++) {
      run += Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]);
      if (run < gap) continue;
      const tx = s[i + 2][0] - s[i - 2][0];
      const ty = s[i + 2][1] - s[i - 2][1];
      const tl = Math.hypot(tx, ty) || 1;
      const ux = tx / tl;
      const uy = ty / tl;
      side = -side;
      const nx = -uy * side;
      const ny = ux * side;
      // how far it is to the stroke's edge on this side
      let d = 0;
      while (d < 16 * GRAIN && inside(s[i][0] + nx * d, s[i][1] + ny * d)) d += 0.5;
      if (d < 2.5 * GRAIN || d >= 16 * GRAIN) continue;
      const bx = s[i][0] + nx * (d - 0.8 * GRAIN);
      const by = s[i][1] + ny * (d - 0.8 * GRAIN);
      const len = (5 + rand() * 6) * GRAIN;
      const base = (1.5 + rand() * 1.2) * GRAIN;
      // hooked back along the stroke, the way a bramble's thorns grow
      const tipX = bx + nx * len - ux * len * 0.55;
      const tipY = by + ny * len - uy * len * 0.55;
      g.beginPath();
      g.moveTo(bx + ux * base, by + uy * base);
      g.quadraticCurveTo(bx + nx * len * 0.45, by + ny * len * 0.45, tipX, tipY);
      g.lineTo(bx - ux * base, by - uy * base);
      g.closePath();
      g.fill();
      run = 0;
      gap = (18 + rand() * 30) * GRAIN;
    }
  }
}

/**
 * Letters one word in the font, set a touch tighter than it comes, with
 * hairlines held to a readable weight and thorns along its fuller strokes.
 */
function letter(text: string, family: string, seed: number): Word {
  const font = `${WORK}px ${family}`;
  const probe = makeCanvas(1, 1).getContext("2d")!;
  probe.font = font;
  const chars = [...text];
  const advances = chars.map(c => probe.measureText(c).width);
  const track = TRACKING * WORK;
  const set = advances.reduce((sum, a) => sum + a, 0) + track * (chars.length - 1);
  // swash capitals and tails reach well past their advances; set the word with room
  // to spare, then crop to the ink
  const room = WORK * 0.8;
  const sheet = makeCanvas(set + room * 2, WORK * 1.2 + room * 2);
  const sg = sheet.getContext("2d", { willReadFrequently: true })!;
  sg.font = font;
  sg.fillStyle = "#fff";
  const line = room + WORK * 0.9;
  let pen = room;
  chars.forEach((c, i) => {
    sg.fillText(c, pen, line);
    pen += advances[i] + track;
  });
  const full = sg.getImageData(0, 0, sheet.width, sheet.height).data;
  let x0 = sheet.width;
  let y0 = sheet.height;
  let x1 = 0;
  let y1 = 0;
  for (let i = 3, p = 0; i < full.length; i += 4, p++) {
    if (full[i] < 40) continue;
    const x = p % sheet.width;
    const y = Math.floor(p / sheet.width);
    x0 = Math.min(x0, x);
    x1 = Math.max(x1, x);
    y0 = Math.min(y0, y);
    y1 = Math.max(y1, y);
  }

  // the word's own canvas: its ink, with a margin for thorns
  const pad = Math.round(40 * GRAIN);
  const w = x1 - x0 + 1 + pad * 2;
  const h = y1 - y0 + 1 + pad * 2;
  const ink = makeCanvas(w, h);
  const g = ink.getContext("2d", { willReadFrequently: true })!;
  g.drawImage(sheet, x0 - pad, y0 - pad, w, h, 0, 0, w, h);
  const baseline = line - (y0 - pad);

  const alpha = g.getImageData(0, 0, w, h).data;
  // follow the centre lines at half size: the same strokes for a quarter of the work
  const hw = Math.ceil(w / 2);
  const hh = Math.ceil(h / 2);
  const small = makeCanvas(hw, hh).getContext("2d", { willReadFrequently: true })!;
  small.drawImage(ink, 0, 0, hw, hh);
  const halfAlpha = small.getImageData(0, 0, hw, hh).data;
  const solid = new Uint8Array(hw * hh);
  for (let i = 0; i < solid.length; i++) solid[i] = halfAlpha[i * 4 + 3] > 110 ? 1 : 0;
  const strokes = trace(solid, hw, hh).map(s => s.map(([x, y]): Point => [x * 2, y * 2]));
  // keep hairlines readable, then grow the thorns
  g.strokeStyle = "#fff";
  g.lineWidth = 2.8 * GRAIN;
  g.lineCap = "round";
  g.lineJoin = "round";
  for (const s of strokes) {
    g.beginPath();
    s.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.stroke();
  }
  thorns(g, alpha, w, h, strokes, seeded(seed));
  const done = g.getImageData(0, 0, w, h).data;
  const bottoms = new Int16Array(w).fill(-1);
  for (let x = 0; x < w; x++) {
    for (let y = h - 1; y >= 0; y--) {
      if (done[(y * w + x) * 4 + 3] > 60) {
        bottoms[x] = y;
        break;
      }
    }
  }
  const margin = 12 * GRAIN;
  return { ink, strokes, box: { x: pad - margin, y: pad - margin, w: w - (pad - margin) * 2, h: h - (pad - margin) * 2 }, baseline, bottoms };
}

/** Generate a stamp trail that traces a Word's strokes, centered at (cx, cy) device px. */
function wordTrail(word: Word, cx: number, cy: number, DPR: number, targetCssWidth: number): { trail: Touch[]; r: number } {
  const k = targetCssWidth / word.box.w;
  const ks = k * DPR;
  const ox = cx - (word.box.x + word.box.w / 2) * ks;
  const oy = cy - (word.box.y + word.box.h / 2) * ks;

  const trail: Touch[] = [];
  const r = Math.max(8 * DPR, REACH * ks * 0.55);
  const step = r * 0.4;
  let d = 0;

  for (const stroke of word.strokes) {
    const pts = stroke.map(([px, py]): Point => [ox + px * ks, oy + py * ks]);
    const prior = trail[trail.length - 1];
    if (prior) d += Math.hypot(pts[0][0] - prior.x, pts[0][1] - prior.y) * 1.5 + 150 * DPR;
    let [lx, ly] = pts[0];
    trail.push({ x: lx, y: ly, d });
    for (const [px, py] of pts) {
      let gapToNext = Math.hypot(px - lx, py - ly);
      while (gapToNext >= step) {
        lx += ((px - lx) * step) / gapToNext;
        ly += ((py - ly) * step) / gapToNext;
        d += step;
        trail.push({ x: lx, y: ly, d });
        gapToNext -= step;
      }
    }
  }
  return { trail, r };
}

/** Generate a stamp trail that draws a heart shape centered at (cx, cy) device px. */
function heartTrail(cx: number, cy: number, cssSize: number, DPR: number): { trail: Touch[]; r: number } {
  const r = 14 * DPR;
  const step = r * 0.3;
  const size = cssSize * DPR;
  const trail: Touch[] = [];
  let d = 0;
  let lx = 0, ly = 0;
  const N = 360;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * TAU;
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    const px = cx + (hx / 16) * size;
    const py = cy + (hy / 17) * size;
    if (i > 0) {
      const dd = Math.hypot(px - lx, py - ly);
      if (dd < step * 0.5) continue;
      d += dd;
    }
    trail.push({ x: px, y: py, d });
    lx = px;
    ly = py;
  }
  return { trail, r };
}

export interface FoggedGlassProps {
  photoLeft: string;
  photoRight: string;
  /** The font file to letter text phases in; a generic cursive stands in without one. */
  font?: string;
  /** Ordered phases to animate: each draws in the fog, refogs, then the next starts. */
  phases?: Array<{ text?: string; shape?: 'heart' }>;
  /** Called once the first phase finishes writing. */
  onWritten?: () => void;
  /** The phases fill the space above this element. */
  above?: React.RefObject<HTMLElement | null>;
}

export const FoggedGlass: React.FC<FoggedGlassProps> = ({ photoLeft, photoRight, font, phases, above, onWritten }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const clearRef = useRef<HTMLCanvasElement>(null);
  const fogRef = useRef<HTMLCanvasElement>(null);
  const writtenRef = useRef(onWritten);
  useEffect(() => {
    writtenRef.current = onWritten;
  });

  useEffect(() => {
    const host = hostRef.current;
    const clearCv = clearRef.current;
    const fogCv = fogRef.current;
    if (!host || !clearCv || !fogCv) return;
    const cc = clearCv.getContext("2d");
    const fc = fogCv.getContext("2d");
    const mask = makeCanvas(1, 1);
    const mc = mask.getContext("2d");
    if (!cc || !fc || !mc) return;

    const dripBead = makeDripBead();
    const mistBead = makeMistBead();
    const stamps: Stamp[] = [];
    const drips: Drip[] = [];

    let W = 0;
    let H = 0;
    let DPR = 1;
    let S = 1;
    let photos: HTMLImageElement[] | null = null;
    let fog: HTMLCanvasElement | null = null;
    let last: { x: number; y: number; t: number } | null = null;
    let raf = 0;
    let running = false;
    let prev = performance.now();
    let resizeTimer = 0;
    let disposed = false;
    // Phase animation state
    let phaseWords: Word[] = [];
    let phaseTrails: { trail: Touch[]; r: number }[] = [];
    let phaseIdx = 0;
    let phaseNext = 0;
    let phaseAt = 0;
    let phaseSpeed = 0;
    let phaseStart = 0;
    let phaseEndTime = 0;
    let phasesDone = false;
    let phaseClearFor = CLEAR_FOR;

    // A running drop is a tiny upside-down lens on whatever sits behind the glass.
    const lens = (src: HTMLCanvasElement, x: number, y: number, r: number, alpha: number): void => {
      fc.save();
      fc.globalAlpha = alpha;
      fc.beginPath();
      fc.arc(x, y, r, 0, TAU);
      fc.clip();
      const k = 1.9;
      fc.translate(x, y);
      fc.scale(1, -1);
      fc.drawImage(src, x - r * k, y - r * k, r * k * 2, r * k * 2, -r, -r, r * 2, r * 2);
      fc.restore();
      fc.globalAlpha = alpha;
      fc.drawImage(dripBead, x - r, y - r, r * 2, r * 2);
      fc.globalAlpha = 1;
    };

    // The scene behind the glass, then the same scene through the mist.
    const build = (): void => {
      if (!photos || !W || !H) return;
      const sharp = makeCanvas(W, H);
      const sg = sharp.getContext("2d")!;
      const half = Math.round(W / 2);
      sg.drawImage(photos[0], 0, 0, half, H);
      sg.drawImage(photos[1], half, 0, W - half, H);
      cc.drawImage(sharp, 0, 0);

      fog = blurred(sharp, 6);
      const soft = blurred(sharp, 3);
      const g = fog.getContext("2d")!;
      // the mist drains the colour, greys it and lifts the shadows
      g.globalCompositeOperation = "saturation";
      g.fillStyle = "rgba(128,128,128,.45)";
      g.fillRect(0, 0, W, H);
      g.globalCompositeOperation = "source-over";
      g.fillStyle = "rgba(160,156,146,.44)";
      g.fillRect(0, 0, W, H);
      g.fillStyle = "rgba(250,248,240,.05)";
      g.fillRect(0, 0, W, H);

      const rand = seeded(1512);
      const area = (W * H) / (DPR * DPR);
      // condensation too fine to see one by one
      for (let i = 0; i < area / 160; i++) {
        const x = rand() * W;
        const y = rand() * H;
        const size = (0.5 + rand() * 0.8) * DPR;
        const t = rand();
        g.fillStyle = t > 0.35 ? `rgba(255,252,244,${0.1 + t * 0.18})` : `rgba(40,32,20,${0.08 + t * 0.2})`;
        g.fillRect(x, y, size, size);
      }
      // drops: many specks, plenty of beads, a few big ones
      const unit = DPR * Math.sqrt(S);
      const sizes: [number, number, number, number, number][] = [
        [area / 620, 1.8, 3.6, 0.6, 1],
        [area / 6000, 3.6, 5.6, 0.7, 1],
        [area / 130, 0.6, 1.8, 0.2, 0.5],
      ];
      for (const [count, r0, r1, a0, a1] of sizes) {
        for (let i = 0; i < count; i++) {
          const x = rand() * W;
          const y = rand() * H;
          const r = (r0 + rand() * (r1 - r0)) * unit;
          const a = a0 + rand() * (a1 - a0);
          const sq = 0.82 + rand() * 0.3;
          // bigger drops are clear enough to show a blurry, upside-down glimpse
          if (r > 1.8 * DPR) {
            g.save();
            g.globalAlpha = 0.55 * a;
            g.beginPath();
            g.ellipse(x, y, r * sq, r, 0, 0, TAU);
            g.clip();
            g.translate(x, y);
            g.scale(1, -1);
            g.drawImage(soft, x - r * 2.4, y - r * 2.4, r * 4.8, r * 4.8, -r, -r, r * 2, r * 2);
            g.restore();
          }
          g.globalAlpha = a;
          g.drawImage(mistBead, x - r * sq, y - r, r * 2 * sq, r * 2);
          g.globalAlpha = 1;
        }
      }
      if (phases?.length) {
        // phases mode: stamp-based animation that refogs between phases
        phaseTrails = [];
        phaseIdx = 0;
        phaseNext = 0;
        phaseAt = 0;
        phaseEndTime = 0;
        phasesDone = false;

        const cssW = W / DPR;
        const cssH = H / DPR;
        let wordIdx = 0;

        for (const phase of phases) {
          if (phase.text && phaseWords[wordIdx]) {
            const word = phaseWords[wordIdx++];
            const targetW = Math.min(cssW * 1.1, 880);
            phaseTrails.push(wordTrail(word, W / 2, H * 0.38, DPR, targetW));
          } else if (phase.shape === 'heart') {
            const heartSize = Math.min(cssW, cssH) * 0.2;
            phaseTrails.push(heartTrail(W / 2, H * 0.38, heartSize, DPR));
          }
        }

        if (phaseTrails.length) {
          const first = phaseTrails[0];
          const total = first.trail[first.trail.length - 1]?.d ?? 0;
          const drawMs = 7000;
          phaseSpeed = total / drawMs;
          phaseClearFor = drawMs + 1500;
          phaseStart = performance.now() + 600;
        }
      } else {
        writtenRef.current?.();
      }
      draw(performance.now());
      host.dataset.ready = "true";
      if (phaseTrails.length && !phasesDone) wake();
    };

    const drip = (x: number, y: number, now: number, size = 1): void => {
      drips.push({
        x,
        y0: y,
        y,
        r: (3.3 + Math.random() * 1.7) * DPR * Math.sqrt(S) * size,
        v: 0,
        go: 250 + Math.random() * 650,
        reach: (25 + Math.random() * 205) * DPR * S,
        t: now,
        moved: now,
        stuck: false,
        done: false,
      });
    };

    // Water gathers at the low edge of a wiped patch and runs.
    const stamp = (x: number, y: number, R: number, now: number, clearFor?: number): void => {
      const self: Stamp = { x, y, r: R * (0.9 + Math.random() * 0.2), t: now, clearFor };
      stamps.push(self);
      if (Math.random() >= 0.12) return;
      const off = (Math.random() * 1.5 - 0.75) * self.r;
      const bx = x + off;
      const by = y + Math.sqrt(self.r * self.r - off * off) - 2 * DPR;
      // only from the true lower edge, not from inside something still clear
      const below = (s: Stamp): boolean => s !== self && now - s.t < (s.clearFor ?? CLEAR_FOR) && Math.hypot(bx - s.x, by + 6 * DPR - s.y) < s.r;
      if (stamps.some(below)) return;
      drip(bx, by, now);
    };

    const wipe = (x: number, y: number, now: number): void => {
      const R = WIPE_RADIUS * S * DPR;
      if (last && now - last.t < 120) {
        const dx = x - last.x;
        const dy = y - last.y;
        const d = Math.hypot(dx, dy);
        const step = R * 0.3;
        for (let s = step; s < d; s += step) stamp(last.x + (dx * s) / d, last.y + (dy * s) / d, R, now);
      }
      stamp(x, y, R, now);
      last = { x, y, t: now };
    };

    const writePhases = (now: number, dt: number): void => {
      if (!phaseTrails.length || phasesDone) return;
      if (phaseIdx >= phaseTrails.length) { phasesDone = true; return; }

      const current = phaseTrails[phaseIdx];

      if (now < phaseStart) return;

      if (phaseNext < current.trail.length) {
        phaseAt += phaseSpeed * dt;
        while (phaseNext < current.trail.length && current.trail[phaseNext].d <= phaseAt) {
          const t = current.trail[phaseNext++];
          stamp(t.x, t.y, current.r, now, phaseClearFor);
        }
        if (phaseNext >= current.trail.length && !phaseEndTime) {
          phaseEndTime = now;
          if (phaseIdx === 0) writtenRef.current?.();
        }
        return;
      }

      if (!phaseEndTime) phaseEndTime = now;
      if (now - phaseEndTime < phaseClearFor + REFOG + 600) return;

      phaseIdx++;
      if (phaseIdx >= phaseTrails.length) { phasesDone = true; return; }
      const next = phaseTrails[phaseIdx];
      const total = next.trail[next.trail.length - 1]?.d ?? 0;
      phaseNext = 0;
      phaseAt = 0;
      const drawMs = 1800;
      phaseSpeed = total / drawMs;
      phaseClearFor = drawMs + 1500;
      phaseStart = now;
      phaseEndTime = 0;
    };

    const stepDrips = (now: number, dt: number): void => {
      for (const d of drips) {
        if (d.done) continue;
        // stick, slip, stick: water never runs at one speed
        if (now - d.moved > d.go) {
          d.stuck = !d.stuck;
          d.moved = now;
          d.go = d.stuck ? 150 + Math.random() * 950 : 300 + Math.random() * 900;
        }
        const target = d.stuck ? 0 : (30 + Math.random() * 45) * DPR * S;
        d.v += (target - d.v) * Math.min(1, dt / 160);
        d.y += (d.v * dt) / 1000;
        if (d.y - d.y0 > d.reach || d.y > H + 10) d.done = true;
      }
    };

    const draw = (now: number): boolean => {
      if (!fog) return false;
      while (stamps.length && now - stamps[0].t > (stamps[0].clearFor ?? CLEAR_FOR) + REFOG) stamps.shift();
      for (let i = drips.length - 1; i >= 0; i--) {
        if (now - drips[i].t > STREAK_FOR + STREAK_FADE) drips.splice(i, 1);
      }

      // the clear-through mask
      mc.clearRect(0, 0, mask.width, mask.height);
      for (const s of stamps) {
        const a = clearness(now - s.t, s.clearFor ?? CLEAR_FOR, REFOG);
        if (a <= 0) continue;
        mc.fillStyle = `rgba(0,0,0,${a})`;
        mc.beginPath();
        mc.arc(s.x * MASK_SCALE, s.y * MASK_SCALE, s.r * MASK_SCALE, 0, TAU);
        mc.fill();
      }
      mc.lineCap = "round";
      for (const d of drips) {
        const a = clearness(now - d.t, STREAK_FOR, STREAK_FADE);
        if (a <= 0) continue;
        mc.strokeStyle = `rgba(0,0,0,${a})`;
        mc.lineWidth = d.r * 1.05 * MASK_SCALE;
        mc.beginPath();
        mc.moveTo(d.x * MASK_SCALE, d.y0 * MASK_SCALE);
        mc.lineTo(d.x * MASK_SCALE, d.y * MASK_SCALE);
        mc.stroke();
      }

      fc.globalCompositeOperation = "source-over";
      fc.clearRect(0, 0, W, H);
      fc.drawImage(fog, 0, 0);
      // the letters erase its middle below, leaving only the rim
      fc.globalCompositeOperation = "destination-out";
      fc.imageSmoothingQuality = "high";
      fc.drawImage(mask, 0, 0, W, H);
      fc.globalCompositeOperation = "source-over";
      for (const d of drips) {
        const a = clearness(now - d.t, STREAK_FOR, STREAK_FADE);
        if (a > 0) lens(clearCv, d.x, d.y, d.r, a);
      }
      return stamps.length > 0 || drips.length > 0 || (phaseTrails.length > 0 && !phasesDone);
    };

    // Only animate while something on the glass is changing.
    const frame = (now: number): void => {
      const dt = clamp(now - prev, 0, 64);
      prev = now;
      writePhases(now, dt);
      stepDrips(now, dt);
      running = draw(now);
      if (running) raf = requestAnimationFrame(frame);
    };
    const wake = (): void => {
      if (running || disposed) return;
      running = true;
      prev = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const onPointerMove = (e: PointerEvent): void => {
      if (!fog) return;
      const rect = fogCv.getBoundingClientRect();
      const events = e.getCoalescedEvents?.() ?? [];
      for (const ev of events.length ? events : [e]) {
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        if (x < -60 || y < -60 || x > rect.width + 60 || y > rect.height + 60) continue;
        wipe(x * DPR, y * DPR, ev.timeStamp || performance.now());
      }
      wake();
    };
    const onPointerLeave = (): void => {
      last = null;
    };

    const resize = (): void => {
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      DPR = Math.min(window.devicePixelRatio || 1, 1.5);
      S = clamp(rect.width / COMP_WIDTH, 0.55, 1.6);
      const w = Math.round(rect.width * DPR);
      const h = Math.round(rect.height * DPR);
      if (w === W && h === H) return;
      W = w;
      H = h;
      for (const c of [clearCv, fogCv]) {
        c.width = W;
        c.height = H;
      }
      mask.width = Math.ceil(W * MASK_SCALE);
      mask.height = Math.ceil(H * MASK_SCALE);
      stamps.length = 0;
      drips.length = 0;
      build();
    };

    const observer = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      if (!W) resize();
      else resizeTimer = window.setTimeout(resize, 120);
    });
    observer.observe(host);
    window.addEventListener("pointermove", onPointerMove);
    document.documentElement.addEventListener("pointerleave", onPointerLeave);

    const needsFont = phases?.some(p => p.text);
    Promise.all([
      loadImage(photoLeft),
      loadImage(photoRight),
      needsFont ? (font ? loadFont(font) : Promise.resolve("cursive")) : Promise.resolve(""),
    ])
      .then(([left, right, family]) => {
        if (disposed) return;
        if (phases && family) {
          phaseWords = phases
            .filter(p => p.text)
            .map((p, i) => letter(p.text!, family || "cursive", 7 + i));
        }
        photos = [left, right];
        if (W) build();
        else resize();
      })
      .catch((error: unknown) => {
        console.error(error);
        writtenRef.current?.();
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [photoLeft, photoRight, font, phases, above]);

  return (
    <Glass ref={hostRef} aria-hidden="true">
      <Layer ref={clearRef} />
      <Layer ref={fogRef} />
    </Glass>
  );
};

export default FoggedGlass;
