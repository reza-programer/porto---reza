/*
 * Hand-drawn SVG paths. Every wobble comes from a seeded generator, so the
 * same seed always draws the same line and server and client markup match.
 */

type Point = [number, number];

function random(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const f = (n: number) => n.toFixed(1);

/**
 * The four sides of a rectangle as separate strokes, each overshooting its
 * corners a little and bowing slightly, the way a marker outline looks.
 * Returned separately so they can draw in one after another.
 */
export function sketchRect(x: number, y: number, w: number, h: number, seed = 1, wobble = 5): string[] {
  const r = random(seed);
  const j = () => (r() - 0.5) * 2 * wobble;

  const side = (x1: number, y1: number, x2: number, y2: number) => {
    const len = Math.hypot(x2 - x1, y2 - y1);
    const ux = (x2 - x1) / len;
    const uy = (y2 - y1) / len;
    const start = r() * wobble * 1.8;
    const end = r() * wobble * 1.8;
    const sx = x1 - ux * start + j();
    const sy = y1 - uy * start + j();
    const ex = x2 + ux * end + j();
    const ey = y2 + uy * end + j();
    // Bow the middle sideways, perpendicular to the side.
    const bow = j() * 1.4;
    const mx = (sx + ex) / 2 - uy * bow;
    const my = (sy + ey) / 2 + ux * bow;
    return `M${f(sx)} ${f(sy)} Q${f(mx)} ${f(my)} ${f(ex)} ${f(ey)}`;
  };

  return [side(x, y, x + w, y), side(x + w, y, x + w, y + h), side(x + w, y + h, x, y + h), side(x, y + h, x, y)];
}

/** A curved arrow from `from` to `to`, bending through `via`, with a two-stroke head. */
export function sketchArrow(from: Point, via: Point, to: Point, head = 12): string[] {
  const [tx, ty] = to;
  // Direction of the curve at its end is from the control point to the tip.
  const angle = Math.atan2(ty - via[1], tx - via[0]);
  const wing = (offset: number) =>
    `M${f(tx)} ${f(ty)} L${f(tx - head * Math.cos(angle + offset))} ${f(ty - head * Math.sin(angle + offset))}`;

  return [`M${f(from[0])} ${f(from[1])} Q${f(via[0])} ${f(via[1])} ${f(tx)} ${f(ty)}`, wing(0.5), wing(-0.5)];
}

/** A leaf from `base` to `tip`, `width` wide at its middle. */
export function leaf(base: Point, tip: Point, width: number): string {
  const [bx, by] = base;
  const [tx, ty] = tip;
  const len = Math.hypot(tx - bx, ty - by);
  const nx = -(ty - by) / len;
  const ny = (tx - bx) / len;
  const mx = (bx + tx) / 2;
  const my = (by + ty) / 2;
  return `M${f(bx)} ${f(by)} Q${f(mx + nx * width)} ${f(my + ny * width)} ${f(tx)} ${f(ty)} Q${f(mx - nx * width)} ${f(my - ny * width)} ${f(bx)} ${f(by)} Z`;
}

/** Deterministic scatter of points inside a box (cork texture, specks). */
export function scatter(x: number, y: number, w: number, h: number, count: number, seed = 7): Point[] {
  const r = random(seed);
  return Array.from({ length: count }, () => [x + r() * w, y + r() * h] as Point);
}
