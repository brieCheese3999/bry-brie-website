import { useEffect, useRef } from 'react';

/* ─── constants ─── */
const CW = 8, CH = 12;
const RAMP = ':;tSX%8@';
const GHOST = '#8B%@S';
const SPECK = "'`.,";
const GLYPHS = [...new Set(RAMP + GHOST + SPECK + 'o')];
const ACCENTS = ['#3d8b69','#2c7d86','#7b63d8','#c4583f','#b38b2c','#4f6dd2'];
const DEEP_INKS = ['#08090c','#17443e','#1a2232','#204f3c'];
const INK = ['#ffffff','#151515','#3b3b3b',...DEEP_INKS,...ACCENTS];
const DEEP0 = 3, ACCENT0 = 3 + DEEP_INKS.length;
const TAU = Math.PI * 2;
const GI: Record<string, number> = {};
GLYPHS.forEach((g, i) => { GI[g] = i; });

const INITIAL_DELAY = 120;
const SHOW_DURATION = 300;
const BREAK_DURATION = 120;
const CYCLE = SHOW_DURATION + BREAK_DURATION;

/* ─── utils ─── */
const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const clamp01 = (v: number) => v < 0 ? 0 : v > 1 ? 1 : v;
const hash = (x: number, y: number, z = 0) => {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 2147483647);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const rgb = (c: number[]) => `rgb(${c[0]},${c[1]},${c[2]})`;
const ell = (ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, rot = 0) => {
  ctx.beginPath(); ctx.ellipse(x, y, Math.max(0.01, rx), Math.max(0.01, ry), rot, 0, TAU);
};

/* ─── butterfly looks ─── */
const LOOKS = [
  { wing: [232,120,168], root: [210,80,140], edge: [60,24,38], dots: true, band: null as number[]|null },
  { wing: [52,122,228], root: [96,172,246], edge: [18,22,40], dots: false, band: null as number[]|null },
  { wing: [246,214,72], root: [236,188,48], edge: [176,132,30], dots: false, band: null as number[]|null },
  { wing: [126,39,64], root: [100,28,48], edge: [56,16,30], dots: true, band: [168,60,90] },
];

/* ─── choreography timeline ─── */
// edges: 0=left 1=right 2=top 3=bottom
// Each butterfly enters and exits from different edges.
// No two consecutive exits share a direction.
const CHOREO = [
  { t: 0,   act: 'enter' as const, id: 1, edge: 0 },   // B1 from left
  { t: 40,  act: 'exit'  as const, id: 1, edge: 1 },   // B1 to right
  { t: 60,  act: 'enter' as const, id: 2, edge: 2 },   // B2 from top
  { t: 100, act: 'enter' as const, id: 3, edge: 1 },   // B3 from right
  { t: 150, act: 'enter' as const, id: 4, edge: 3 },   // B4 from bottom
  { t: 158, act: 'exit'  as const, id: 2, edge: 3 },   // B2 to bottom (8s after B4)
  { t: 220, act: 'exit'  as const, id: 3, edge: 0 },   // B3 to left
  { t: 250, act: 'exit'  as const, id: 4, edge: 2 },   // B4 to top
];

/* ─── butterfly class ─── */
class Butterfly {
  x: number; y: number; heading: number;
  size: number; speed: number; lift: number;
  age = 0; phase: number;
  look: typeof LOOKS[0];
  flapRate: number; flap: number; open = 1;
  glide = 0; nextGlide: number;
  wander: number[];
  turnBase: number; turnAmp: number;
  bob = 0;
  trail: { x: number; y: number; t: number }[] = [];
  exiting = false;
  exitTarget = { x: 0, y: 0 };
  dead = false; seen = false;
  W: number; H: number; sc: number;

  constructor(entryEdge: number, lookIdx: number, W: number, H: number) {
    this.W = W; this.H = H;
    this.sc = Math.max(0.6, Math.min(1, Math.min(W, H * 1.2) / 900));
    this.size = rnd(200, 280) * this.sc;
    this.speed = rnd(48, 80) * this.sc;
    this.lift = this.size * 0.14;
    this.look = LOOKS[lookIdx % LOOKS.length];
    this.flapRate = rnd(3.2, 4.2);
    this.flap = rnd(0, TAU);
    this.nextGlide = rnd(2, 5);
    this.phase = rnd(0, TAU);
    this.wander = [rnd(0.3, 0.7), rnd(0, TAU), rnd(0.9, 1.7), rnd(0, TAU)];
    this.turnBase = rnd(-0.15, 0.15);
    this.turnAmp = rnd(0.7, 1.2);
    const m = this.size * 0.8 + 20;
    const tx = rnd(W * 0.25, W * 0.75), ty = rnd(H * 0.25, H * 0.75);
    switch (entryEdge) {
      case 0: this.x = -m; this.y = rnd(H*0.2, H*0.8); break;
      case 1: this.x = W+m; this.y = rnd(H*0.2, H*0.8); break;
      case 2: this.x = rnd(W*0.2, W*0.8); this.y = -m; break;
      default: this.x = rnd(W*0.2, W*0.8); this.y = H+m;
    }
    this.heading = Math.atan2(ty - this.y, tx - this.x) + rnd(-0.35, 0.35);
  }

  startExit(edge: number) {
    this.exiting = true;
    const m = 300;
    switch (edge) {
      case 0: this.exitTarget = { x: -m, y: rnd(this.H*0.2, this.H*0.8) }; break;
      case 1: this.exitTarget = { x: this.W+m, y: rnd(this.H*0.2, this.H*0.8) }; break;
      case 2: this.exitTarget = { x: rnd(this.W*0.2, this.W*0.8), y: -m }; break;
      default: this.exitTarget = { x: rnd(this.W*0.2, this.W*0.8), y: this.H+m };
    }
  }

  update(dt: number) {
    this.age += dt;
    if (this.exiting) {
      const ta = Math.atan2(this.exitTarget.y - this.y, this.exitTarget.x - this.x);
      let d = ta - this.heading;
      while (d > Math.PI) d -= TAU;
      while (d < -Math.PI) d += TAU;
      this.heading += d * Math.min(1, dt * 2);
    } else {
      const [f1, p1, f2, p2] = this.wander;
      const w = Math.sin(f1 * this.age + p1) * 0.65 + Math.sin(f2 * this.age + p2) * 0.35;
      this.heading += (this.turnBase + this.turnAmp * w) * dt;
      const mg = this.W * 0.12;
      const cx = this.W / 2, cy = this.H / 2;
      if (this.x < mg || this.x > this.W - mg || this.y < mg || this.y > this.H - mg) {
        const toC = Math.atan2(cy - this.y, cx - this.x);
        let d = toC - this.heading;
        while (d > Math.PI) d -= TAU;
        while (d < -Math.PI) d += TAU;
        this.heading += d * dt * 0.9;
      }
    }
    if (this.glide > 0) {
      this.glide -= dt;
      this.open += (1 - this.open) * Math.min(1, dt * 8);
      if (this.glide <= 0) this.flap = 0;
    } else {
      this.nextGlide -= dt;
      if (this.nextGlide < 0) { this.glide = rnd(0.5, 1.1); this.nextGlide = rnd(2.5, 6); }
      this.flap += dt * this.flapRate * TAU;
      this.open = 0.5 + 0.5 * Math.cos(this.flap);
    }
    this.bob = Math.sin(this.age * 2.4 + this.phase) * this.size * 0.06;
    const v = this.exiting ? this.speed * 1.2 :
              this.glide > 0 ? this.speed * 1.05 :
              this.speed * (0.75 + 0.5 * Math.max(0, Math.sin(this.flap)));
    this.x += Math.cos(this.heading) * v * dt;
    this.y += Math.sin(this.heading) * v * dt;
    const last = this.trail[0];
    if (!last || Math.hypot(this.x - last.x, this.y - last.y) > 7)
      this.trail.unshift({ x: this.px(), y: this.py(), t: this.age });
    while (this.trail.length && this.age - this.trail[this.trail.length - 1].t > 1.1)
      this.trail.pop();
    const sm = this.size * 0.7;
    const on = this.x + sm > 0 && this.x - sm < this.W && this.y + sm > 0 && this.y - sm < this.H;
    if (on) this.seen = true;
    if (this.exiting && this.seen && !on) this.dead = true;
  }

  px() { return this.x - Math.sin(this.heading) * this.bob; }
  py() { return this.y + Math.cos(this.heading) * this.bob; }
  spread() { return 0.28 + 0.72 * Math.pow(this.open, 0.55); }

  wingPath(c: CanvasRenderingContext2D, s: number, fore: boolean) {
    const S = this.size;
    if (fore) {
      c.moveTo(.06*S, s*.03*S);
      c.bezierCurveTo(.16*S, s*.12*S, .25*S, s*.34*S, .2*S, s*.5*S);
      c.bezierCurveTo(.12*S, s*.55*S, 0, s*.5*S, -.04*S, s*.4*S);
      c.bezierCurveTo(-.06*S, s*.26*S, -.04*S, s*.1*S, 0, s*.03*S);
    } else {
      c.moveTo(0, s*.03*S);
      c.bezierCurveTo(.02*S, s*.22*S, -.04*S, s*.4*S, -.16*S, s*.4*S);
      c.bezierCurveTo(-.27*S, s*.38*S, -.33*S, s*.26*S, -.3*S, s*.16*S);
      c.bezierCurveTo(-.26*S, s*.08*S, -.12*S, s*.03*S, 0, s*.03*S);
    }
    c.closePath();
  }

  draw(c: CanvasRenderingContext2D) {
    if (this.trail.length) {
      c.fillStyle = rgb(this.look.wing);
      for (const p of this.trail) {
        c.globalAlpha = 0.26 * (1 - (this.age - p.t) / 1.1);
        ell(c, p.x, p.y, 2.6, 2.6); c.fill();
      }
    }
    const x = this.px(), y = this.py();
    c.save();
    c.translate(x + this.lift * 0.5, y + this.lift);
    c.rotate(this.heading);
    c.save(); c.scale(1, this.spread());
    c.beginPath();
    for (const s of [1, -1]) { this.wingPath(c, s, true); this.wingPath(c, s, false); }
    c.restore();
    c.globalAlpha = 0.055; c.fillStyle = 'rgb(40,36,30)'; c.fill();
    c.restore();
    c.save();
    c.translate(x, y); c.rotate(this.heading);
    c.globalAlpha = 1; this.body(c);
    c.restore();
    c.globalAlpha = 1;
  }

  body(c: CanvasRenderingContext2D) {
    const S = this.size, { wing, root, edge, band, dots } = this.look;
    c.save(); c.scale(1, this.spread());
    c.beginPath();
    for (const s of [1, -1]) { this.wingPath(c, s, true); this.wingPath(c, s, false); }
    c.fillStyle = rgb(edge); c.fill();
    for (const s of [1, -1]) {
      c.save();
      c.translate(0, s * .04 * S); c.scale(.8, .8); c.translate(0, -s * .04 * S);
      c.beginPath(); this.wingPath(c, s, true); this.wingPath(c, s, false);
      c.fillStyle = rgb(wing); c.fill(); c.clip();
      c.fillStyle = rgb(root);
      ell(c, -.02*S, s*.08*S, .16*S, .14*S); c.fill();
      if (band) {
        c.strokeStyle = rgb(band); c.lineWidth = .09*S;
        c.beginPath(); c.moveTo(.17*S, s*.2*S); c.lineTo(.02*S, s*.42*S); c.stroke();
        c.beginPath(); c.moveTo(-.04*S, s*.36*S);
        c.quadraticCurveTo(-.2*S, s*.42*S, -.3*S, s*.24*S); c.stroke();
      }
      c.restore();
      c.strokeStyle = rgb(edge); c.lineWidth = 1.4; c.globalAlpha = .6;
      for (const [vx, vy] of [[.17,.42],[.06,.46],[-.03,.36],[-.16,.36],[-.26,.22]]) {
        c.beginPath(); c.moveTo(0, s*.04*S); c.lineTo(vx*S, s*vy*S); c.stroke();
      }
      c.globalAlpha = 1;
      if (dots) {
        c.fillStyle = 'rgb(250,248,240)';
        for (const [dx, dy] of [[.19,.45],[.14,.5],[.07,.5],[0,.46],[-.12,.4],[-.21,.37],[-.28,.27]]) {
          ell(c, dx*S, s*dy*S, .016*S, .016*S); c.fill();
        }
      }
    }
    c.restore();
    c.fillStyle = 'rgb(34,28,24)';
    ell(c, -.05*S, 0, .2*S, .034*S); c.fill();
    ell(c, .16*S, 0, .042*S, .042*S); c.fill();
    c.strokeStyle = 'rgb(34,28,24)'; c.lineWidth = 1.6;
    for (const s of [1, -1]) {
      c.beginPath(); c.moveTo(.18*S, s*.015*S); c.lineTo(.33*S, s*.09*S); c.stroke();
      ell(c, .335*S, s*.092*S, .014*S, .014*S); c.fill();
    }
  }
}

/* ─── component ─── */
export const ButterflyOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    let dead = false;

    const field = document.createElement('canvas');
    const fctx = field.getContext('2d', { willReadFrequently: true })!;
    const atlas = document.createElement('canvas');
    const actx = atlas.getContext('2d')!;

    let W = 0, H = 0, DPR = 1, cols = 0, rows = 0;
    let totalTime = 0;
    let butterflies = new Map<number, Butterfly>();
    let lastChoreoIdx = -1;
    let fadeAlpha = 0;

    function resize() {
      W = innerWidth; H = innerHeight;
      DPR = Math.min(devicePixelRatio || 1, 2);
      cv!.width = Math.round(W * DPR);
      cv!.height = Math.round(H * DPR);
      cv!.style.width = W + 'px';
      cv!.style.height = H + 'px';
      cols = Math.ceil(W / CW);
      rows = Math.ceil(H / CH);
      field.width = cols;
      field.height = rows;
      buildAtlas();
    }

    function buildAtlas() {
      const cw = Math.round(CW * DPR), ch = Math.round(CH * DPR);
      atlas.width = cw * GLYPHS.length;
      atlas.height = ch * INK.length;
      actx.clearRect(0, 0, atlas.width, atlas.height);
      actx.font = `500 ${8.6 * DPR}px "Geist Mono", ui-monospace, monospace`;
      actx.textAlign = 'center';
      actx.textBaseline = 'alphabetic';
      INK.forEach((ink, row) => {
        actx.fillStyle = ink;
        GLYPHS.forEach((g, i) => {
          actx.fillText(g, i * cw + cw / 2, row * ch + 9 * DPR);
        });
      });
    }

    function getShowTime(): number | null {
      const elapsed = totalTime - INITIAL_DELAY;
      if (elapsed < 0) return null;
      const cycleTime = elapsed % CYCLE;
      if (cycleTime >= SHOW_DURATION) return null;
      return cycleTime;
    }

    function step(dt: number) {
      totalTime += dt;
      const showTime = getShowTime();

      if (showTime === null) {
        if (butterflies.size > 0) {
          for (const b of butterflies.values()) {
            if (!b.exiting) b.startExit(Math.floor(Math.random() * 4));
          }
        }
        fadeAlpha = Math.max(0, fadeAlpha - dt * 0.4);
      } else {
        const elapsed = totalTime - INITIAL_DELAY;
        const cycleStart = Math.floor(elapsed / CYCLE) * CYCLE;
        const t = elapsed - cycleStart;

        // reset choreography at cycle start
        if (t < dt * 2) {
          lastChoreoIdx = -1;
          butterflies.clear();
        }

        for (let i = lastChoreoIdx + 1; i < CHOREO.length; i++) {
          if (CHOREO[i].t <= t) {
            const ev = CHOREO[i];
            if (ev.act === 'enter') {
              butterflies.set(ev.id, new Butterfly(ev.edge, ev.id - 1, W, H));
            } else {
              const b = butterflies.get(ev.id);
              if (b) b.startExit(ev.edge);
            }
            lastChoreoIdx = i;
          } else break;
        }

        if (butterflies.size > 0) {
          fadeAlpha = Math.min(0.85, fadeAlpha + dt * 0.3);
        } else if (lastChoreoIdx >= CHOREO.length - 1) {
          fadeAlpha = Math.max(0, fadeAlpha - dt * 0.3);
        }
      }

      for (const [id, b] of butterflies) {
        b.update(dt);
        if (b.dead) butterflies.delete(id);
      }
    }

    function render() {
      if (!cols || !rows || fadeAlpha < 0.01) {
        ctx!.clearRect(0, 0, cv!.width, cv!.height);
        return;
      }

      fctx.setTransform(1, 0, 0, 1, 0, 0);
      fctx.clearRect(0, 0, cols, rows);
      fctx.setTransform(1 / CW, 0, 0, 1 / CH, 0, 0);
      for (const b of butterflies.values()) b.draw(fctx);
      const px = fctx.getImageData(0, 0, cols, rows).data;

      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx!.clearRect(0, 0, W, H);

      const cw = Math.round(CW * DPR), ch = Math.round(CH * DPR);
      const tick = Math.floor(totalTime * 3);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4;
          const a = px[i + 3] / 255;
          if (a < 0.025) continue;
          const pr = px[i], pg = px[i + 1], pb = px[i + 2];
          const h = hash(x, y);
          const X = x * CW, Y = y * CH;

          if (a < 0.07) {
            if (h > 0.4) continue;
            ctx!.globalAlpha = (0.35 + a * 5) * fadeAlpha;
            ctx!.fillStyle = `rgb(${pr},${pg},${pb})`;
            ctx!.fillRect(X + 3, Y + 5, 2, 2);
            continue;
          }

          if (a < 0.3) {
            const glyph = a > 0.2 ? 'o' : SPECK[Math.floor(h * SPECK.length)];
            ctx!.globalAlpha = (0.45 + a * 1.4) * fadeAlpha;
            ctx!.drawImage(atlas, GI[glyph] * cw, 2 * ch, cw, ch, X, Y, CW, CH);
            continue;
          }

          const k = clamp01((a - 0.16) / 0.62);
          let tr = 253 + (pr - 253) * k, tg = 253 + (pg - 253) * k, tb = 253 + (pb - 253) * k;
          const h2 = hash(x, y, tick);
          if (h2 < 0.012) {
            const ac = ACCENTS[Math.floor(h * ACCENTS.length)];
            const ar = parseInt(ac.slice(1, 3), 16), ag = parseInt(ac.slice(3, 5), 16), ab = parseInt(ac.slice(5, 7), 16);
            tr += (ar - tr) * 0.5; tg += (ag - tg) * 0.5; tb += (ab - tb) * 0.5;
          }
          ctx!.globalAlpha = fadeAlpha;
          ctx!.fillStyle = `rgb(${tr | 0},${tg | 0},${tb | 0})`;
          ctx!.beginPath();
          ctx!.roundRect(X + 0.65, Y + 0.7, CW - 1.3, CH - 1.4, 0.8);
          ctx!.fill();

          const lum = tr * 0.3 + tg * 0.59 + tb * 0.11;
          const dark = 1 - lum / 255;
          let glyph: string, ink = 0, alpha: number;
          if (k < 0.42) {
            glyph = GHOST[Math.floor(h * GHOST.length)];
            alpha = 0.5;
          } else {
            const f = clamp01((dark - 0.3) / 0.5) * (RAMP.length - 1) + (h - 0.5) * 2.4;
            glyph = RAMP[Math.max(0, Math.min(RAMP.length - 1, Math.round(f)))];
            alpha = lum > 175 ? 0.55 : 0.93;
            const h3 = hash(y, x, tick);
            if (h2 > 0.975) { ink = ACCENT0 + Math.floor(h3 * ACCENTS.length); alpha = 0.9; }
            else if (h2 > 0.9 && lum < 200) { ink = DEEP0 + Math.floor(h3 * DEEP_INKS.length); alpha = 0.9; }
          }
          ctx!.globalAlpha = alpha * fadeAlpha;
          ctx!.drawImage(atlas, GI[glyph] * cw, ink * ch, cw, ch, X, Y, CW, CH);
        }
      }
      ctx!.globalAlpha = 1;
    }

    let last = 0;
    function frame(now: number) {
      if (dead) return;
      requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!cols && innerWidth) resize();
      step(dt);
      render();
    }

    async function start() {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@500&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      try { await document.fonts.load('500 10px "Geist Mono"'); } catch {}
      if (dead) return;
      resize();
      last = performance.now();
      requestAnimationFrame(frame);
    }

    let resizeTimer: number;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => { if (!dead) resize(); }, 80);
    };
    addEventListener('resize', onResize);

    start();
    return () => {
      dead = true;
      removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
        zIndex: 10000,
      }}
    />
  );
};

export default ButterflyOverlay;
