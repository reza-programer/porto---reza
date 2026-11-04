import React from 'react';
import { leaf, scatter } from '@/lib/sketch';

/*
 * The hero illustration: Reza's desk, drawn flat with ink outlines. A light
 * displacement filter makes the straight lines wobble like they were drawn
 * by hand. Only static art lives here; anything that moves (steam, caret)
 * sits in an unfiltered layer on top so the filtered layer never repaints.
 *
 * Every object is drawn once at its spot in the wide layout; a layout moves
 * whole objects around and picks which part of the scene to show:
 *   wide (1440×820): one long desk with an empty wall on the left for the
 *                    intro text, for laptops and up
 *   mid  (1020×820): the same desk without that empty wall, for tablets,
 *                    where the intro sits above instead
 *   tall (760×1080): wall pieces side by side, mug and plant on a wall
 *                    shelf, the rest on the desk, for phones
 */

export type DeskLayout = 'wide' | 'mid' | 'tall';

/** The part of the scene a layout shows: left edge `x`, width and height. */
export const SCENE: Record<DeskLayout, { x: number; w: number; h: number }> = {
  wide: { x: 0, w: 1440, h: 820 },
  mid: { x: 420, w: 1020, h: 820 },
  tall: { x: 0, w: 760, h: 1080 },
};

type Piece = 'lamp' | 'frame' | 'board' | 'qa' | 'laptop' | 'phone' | 'mug' | 'plant' | 'drawerL' | 'drawerR' | 'room';
type Offset = [number, number];

// How far each object moves from where it is drawn. In the wide layout the
// desk items are nudged right, clear of the intro text on the wall.
const WIDE: Record<Piece, Offset> = {
  lamp: [0, 0],
  frame: [0, 0],
  board: [0, 0],
  qa: [85, 0],
  laptop: [80, 0],
  phone: [70, 0],
  mug: [60, 0],
  plant: [40, 0],
  drawerL: [0, 0],
  drawerR: [0, 0],
  room: [0, 0],
};
const PLACE: Record<DeskLayout, Record<Piece, Offset>> = {
  wide: WIDE,
  mid: WIDE,
  tall: {
    lamp: [-668, 0],
    frame: [-602, 8],
    board: [-630, 0],
    qa: [-380, 248],
    laptop: [-368, 248],
    phone: [-352, 248],
    mug: [-728, -52],
    plant: [-692, -52],
    drawerL: [-30, 248],
    drawerR: [-650, 248],
    room: [0, 248],
  },
};

const at = ([x, y]: Offset) => `translate(${x} ${y})`;

// Matches the site tokens: blue with red and green accents, navy ink.
const C = {
  ink: '#0c2340',
  paper: '#ffffff',
  wall: '#f3f7fc',
  tileLine: '#dbe6f2',
  trim: '#c4d6ea',
  ocean: '#0b5cad',
  oceanDeep: '#08427d',
  oceanDark: '#073766',
  ice: '#a9cdf0',
  board: '#d3e5f7',
  speck: '#b6cfea',
  flame: '#e2231a',
  leaf: '#7ac143',
  leafDark: '#4f9a3c',
  sun: '#ffd23f',
  steel: '#d5dbe3',
  steelDark: '#b8c1cd',
  screen: '#0f1e33',
  screenBar: '#172a47',
  muted: '#7d8ea6',
  coffee: '#3a2a22',
  steam: '#b4c3d6',
};

const ink = { stroke: C.ink, strokeWidth: 3, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

// How far the tiles and desk run past the scene's edges. On wide, short
// screens the scene is scaled down and centred, and the room fills the sides.
const ROOM = 1400;

// Code editor lines on the laptop: indent level, then [width, colour] runs.
const CODE: [number, [number, string][]][] = [
  [0, [[40, '#ff6b5e'], [70, '#e8f0fa']]],
  [1, [[30, C.sun], [92, C.ice]]],
  [2, [[50, C.leaf], [38, '#e8f0fa'], [30, C.sun]]],
  [2, [[82, C.ice]]],
  [3, [[44, C.sun], [64, C.leaf]]],
  [3, [[104, '#e8f0fa']]],
  [2, [[20, '#ff6b5e']]],
  [1, [[20, '#ff6b5e']]],
  [0, []],
  [1, [[36, C.sun], [56, C.ice], [26, C.leaf]]],
  [2, [[90, '#e8f0fa']]],
  [1, [[20, '#ff6b5e']]],
];
const CODE_X = 672;
const CODE_Y = 412;
const CODE_STEP = 13;
const INDENT = 14;

/** Where the blinking caret sits: just after the last run of line 11. */
const CARET = { x: CODE_X + 2 * INDENT + 90 + 5, y: CODE_Y + 10 * CODE_STEP - 4 };

const LEAVES: { tip: [number, number]; w: number; fill: string }[] = [
  { tip: [1262, 430], w: 22, fill: C.leafDark },
  { tip: [1296, 372], w: 24, fill: C.leaf },
  { tip: [1346, 352], w: 26, fill: C.leafDark },
  { tip: [1398, 404], w: 24, fill: C.leaf },
  { tip: [1392, 470], w: 18, fill: C.leafDark },
  { tip: [1284, 482], w: 16, fill: C.leaf },
];
const LEAF_BASE: [number, number] = [1330, 530];

const BOARD_SPECKS = scatter(896, 108, 250, 174, 70, 11);

interface Stat {
  value: number;
  label: string;
}

/** A pinned sticky note, rotated about its centre. */
function StickyNote({ x, y, size, fill, rotate, stat }: { x: number; y: number; size: number; fill: string; rotate: number; stat: Stat }) {
  const cx = x + size / 2;
  return (
    <g transform={`rotate(${rotate} ${cx} ${y + size / 2})`}>
      <rect x={x} y={y} width={size} height={size} fill={fill} {...ink} strokeWidth={2.5} />
      <text x={cx} y={y + size * 0.52} textAnchor="middle" className="font-marker" fontSize={26} fill={C.ink}>
        {stat.value}+
      </text>
      <text x={cx} y={y + size * 0.82} textAnchor="middle" className="font-hand" fontSize={17} fontWeight={600} fill={C.ink}>
        {stat.label}
      </text>
      <circle cx={cx} cy={y + 7} r={5} fill={C.flame} stroke={C.ink} strokeWidth={2} />
    </g>
  );
}

export const DeskScene: React.FC<{ stats: [Stat, Stat, Stat]; layout: DeskLayout }> = ({ stats, layout }) => {
  const { x: ox, w, h } = SCENE[layout];
  const p = PLACE[layout];
  // Both layouts can be in the page at once (one hidden), so ids are per layout.
  const id = (name: string) => `desk-${name}-${layout}`;

  return (
    <svg viewBox={`${ox} 0 ${w} ${h}`} overflow="visible" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <filter id={id('rough')} x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="4" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.2" />
        </filter>
        <pattern id={id('tiles')} width="38" height="38" patternUnits="userSpaceOnUse">
          <rect width="38" height="38" fill={C.wall} />
          <path d="M38 0V38H0" fill="none" stroke={C.tileLine} strokeWidth="1.6" />
        </pattern>
        <radialGradient id={id('glow')}>
          <stop offset="0%" stopColor={C.sun} stopOpacity="0.45" />
          <stop offset="100%" stopColor={C.sun} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Lamp glow and cord sit outside the filter so they stay soft and straight */}
      <g transform={at(p.lamp)}>
        <ellipse cx="1330" cy="270" rx="190" ry="140" fill={`url(#${id('glow')})`} />
        {/* On laptops and tablets the cord runs up past the scene to the ceiling;
            on phones the intro text sits right above, so it stops at the top. */}
        <line x1="1330" y1={layout === 'tall' ? 0 : -ROOM} x2="1330" y2="112" {...ink} />
      </g>

      {/* The room: tiled wall and desk, running well past both edges. Kept
          outside the filter, which would otherwise have to cover all of it. */}
      <g transform={at(p.room)}>
        <rect x={-ROOM} y="452" width={ox + w + 2 * ROOM} height="162" fill={`url(#${id('tiles')})`} />
        <line x1={-ROOM} y1="452" x2={ox + w + ROOM} y2="452" stroke={C.trim} strokeWidth="3" />
        <rect x={-ROOM} y="612" width={ox + w + 2 * ROOM} height="28" fill={C.ocean} />
        <rect x={-ROOM} y="640" width={ox + w + 2 * ROOM} height="220" fill={C.oceanDeep} />
        <path d={`M${-ROOM} 612 H${ox + w + ROOM} M${-ROOM} 640 H${ox + w + ROOM}`} {...ink} />
        <path d={`M${-ROOM} 728 H${ox + w + ROOM}`} stroke={C.oceanDark} strokeWidth="3" />
      </g>

      <g filter={`url(#${id('rough')})`}>
        {/* Pendant lamp */}
        <g transform={at(p.lamp)}>
          <rect x="1318" y="108" width="24" height="14" rx="3" fill={C.ink} />
          <path d="M1300 122 L1360 122 L1392 180 L1268 180 Z" fill={C.ocean} {...ink} />
          <ellipse cx="1330" cy="183" rx="20" ry="7" fill={C.sun} {...ink} strokeWidth={2} />
        </g>

        {/* Framed certificate */}
        <g transform={at(p.frame)}>
          <path d="M672 122 L730 92 L788 122" fill="none" {...ink} strokeWidth={2} />
          <circle cx="730" cy="92" r="4.5" fill={C.ink} />
          <rect x="652" y="118" width="156" height="124" rx="4" fill={C.oceanDeep} {...ink} />
          <rect x="665" y="131" width="130" height="98" fill={C.paper} {...ink} strokeWidth={2} />
          <rect x="690" y="146" width="80" height="7" rx="3.5" fill={C.ink} />
          <rect x="682" y="163" width="96" height="4" rx="2" fill="#c9d5e3" />
          <rect x="690" y="174" width="80" height="4" rx="2" fill="#c9d5e3" />
          <path d="M684 210 q8 -12 14 0 t14 0 t12 -4" fill="none" {...ink} strokeWidth={2} />
          <path d="M756 214 l-6 16 l8 -5 l6 6 z M768 214 l6 16 l-8 -5 l-6 6 z" fill={C.ocean} {...ink} strokeWidth={1.5} />
          <circle cx="762" cy="207" r="12" fill={C.flame} {...ink} strokeWidth={2} />
        </g>

        {/* Pin board */}
        <g transform={at(p.board)}>
          <rect x="880" y="92" width="282" height="206" rx="6" fill={C.ocean} {...ink} />
          <rect x="893" y="105" width="256" height="180" fill={C.board} {...ink} strokeWidth={2} />
          {BOARD_SPECKS.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={1.7} fill={C.speck} />
          ))}
          <path d="M942 122 L1028 126 L1108 120 M942 122 L964 214 M1108 120 L1090 206" fill="none" stroke={C.flame} strokeWidth="1.6" />
          <StickyNote x={905} y={117} size={74} fill={C.leaf} rotate={-5} stat={stats[0]} />
          <StickyNote x={991} y={121} size={74} fill={C.sun} rotate={3} stat={stats[1]} />
          <StickyNote x={1075} y={115} size={68} fill={C.ice} rotate={-2} stat={stats[2]} />
          <g transform="rotate(3 964 238)">
            <rect x="910" y="206" width="110" height="64" fill={C.paper} {...ink} strokeWidth={2} />
            <line x1="920" y1="222" x2="1010" y2="222" stroke={C.flame} strokeWidth="2" />
            <text x="965" y="252" textAnchor="middle" className="font-hand" fontSize={20} fontWeight={700} fill={C.ink}>
              2024 → now
            </text>
            <circle cx="964" cy="212" r="4.5" fill={C.ocean} stroke={C.ink} strokeWidth={2} />
          </g>
          <g transform="rotate(-4 1090 238)">
            <rect x="1042" y="202" width="96" height="70" fill={C.paper} {...ink} strokeWidth={2} />
            <path d="M1054 210 V262 H1128" fill="none" stroke={C.ink} strokeWidth="2" />
            <path d="M1058 254 L1076 244 L1092 248 L1108 230 L1124 220" fill="none" stroke={C.ocean} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="1090" cy="208" r="4.5" fill={C.leaf} stroke={C.ink} strokeWidth={2} />
          </g>
        </g>

        {/* Wall shelf for the mug and plant, only when they leave the desk */}
        {layout === 'tall' && (
          <g>
            <path d="M400 580 L400 618 L438 580 Z M720 580 L720 618 L682 580 Z" fill={C.oceanDeep} {...ink} />
            <rect x="370" y="560" width="370" height="20" rx="3" fill={C.ocean} {...ink} />
          </g>
        )}

        {/* Desk drawers */}
        <g transform={at(p.drawerL)}>
          <rect x="70" y="664" width="300" height="114" rx="6" fill="#0d4f96" {...ink} />
          <rect x="190" y="712" width="60" height="11" rx="5.5" fill={C.paper} stroke={C.ink} strokeWidth="2" />
        </g>
        <g transform={at(p.drawerR)}>
          <rect x="1070" y="664" width="300" height="114" rx="6" fill="#0d4f96" {...ink} />
          <rect x="1190" y="712" width="60" height="11" rx="5.5" fill={C.paper} stroke={C.ink} strokeWidth="2" />
        </g>

        {/* Books and the QA clipboard */}
        <g transform={at(p.qa)}>
          <rect x="400" y="590" width="150" height="22" rx="3" fill={C.ocean} {...ink} />
          <line x1="418" y1="590" x2="418" y2="612" stroke={C.ink} strokeWidth="2" />
          <rect x="410" y="570" width="132" height="20" rx="3" fill={C.leaf} {...ink} />
          <line x1="526" y1="570" x2="526" y2="590" stroke={C.ink} strokeWidth="2" />
          <g transform="rotate(-7 474 590)">
            <rect x="420" y="468" width="108" height="124" rx="6" fill="#2f6fb7" {...ink} />
            <rect x="430" y="486" width="88" height="98" fill={C.paper} {...ink} strokeWidth={2} />
            <rect x="452" y="460" width="44" height="17" rx="4" fill={C.steel} {...ink} strokeWidth={2.5} />
            {[502, 523, 544, 565].map((y, i) => (
              <g key={y}>
                <rect x="438" y={y - 7} width="12" height="12" fill="none" stroke={C.ink} strokeWidth="2" />
                {i === 2 ? (
                  <path d={`M439 ${y - 6} l10 10 m0 -10 l-10 10`} stroke={C.flame} strokeWidth="2.5" strokeLinecap="round" />
                ) : (
                  <path d={`M439 ${y - 1} l4 4 l8 -10`} fill="none" stroke={C.leafDark} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                )}
                <line x1="457" y1={y} x2={i % 2 ? 494 : 508} y2={y} stroke="#b9c6d6" strokeWidth="3" strokeLinecap="round" />
              </g>
            ))}
            {/* Ladybug: the bug that got caught */}
            <circle cx="512" cy="578" r="9" fill={C.flame} stroke={C.ink} strokeWidth="2" />
            <path d="M512 569 V587" stroke={C.ink} strokeWidth="1.5" />
            <circle cx="508" cy="576" r="1.8" fill={C.ink} />
            <circle cx="516" cy="581" r="1.8" fill={C.ink} />
          </g>
        </g>

        {/* Laptop */}
        <g transform={at(p.laptop)}>
          <rect x="600" y="372" width="330" height="214" rx="12" fill={C.ink} {...ink} />
          <rect x="612" y="384" width="306" height="190" rx="4" fill={C.screen} />
          <rect x="612" y="384" width="306" height="16" fill={C.screenBar} />
          <rect x="612" y="384" width="46" height="190" fill={C.screenBar} />
          <rect x="658" y="384" width="72" height="16" fill={C.screen} />
          <rect x="666" y="390" width="40" height="4" rx="2" fill={C.muted} />
          {CODE.map(([indent, runs], i) => {
            const y = CODE_Y + i * CODE_STEP;
            let x = CODE_X + indent * INDENT;
            return (
              <g key={i}>
                <rect x="628" y={y - 2.5} width={i + 1 > 9 ? 14 : 8} height="5" rx="2.5" fill="#3d5372" />
                {runs.map(([w, c], k) => {
                  const rect = <rect key={k} x={x} y={y - 2.5} width={w} height="5" rx="2.5" fill={c} opacity="0.92" />;
                  x += w + 6;
                  return rect;
                })}
              </g>
            );
          })}
          <path d="M580 586 L950 586 L972 612 L558 612 Z" fill={C.steel} {...ink} />
          <path d="M735 586 h60 v4 q0 5 -5 5 h-50 q-5 0 -5 -5 z" fill={C.steelDark} stroke={C.ink} strokeWidth="1.5" />
        </g>

        {/* Phone on its stand */}
        <g transform={at(p.phone)}>
          <path d="M992 612 L1012 588 L1058 588 L1078 612 Z" fill={C.ink} {...ink} />
          <rect x="994" y="424" width="82" height="166" rx="14" fill={C.ink} {...ink} />
          <rect x="1000" y="432" width="70" height="150" rx="9" fill={C.paper} />
          <rect x="1024" y="436" width="22" height="5" rx="2.5" fill={C.ink} />
          <rect x="1007" y="449" width="28" height="4" rx="2" fill={C.ink} />
          <circle cx="1061" cy="451" r="3" fill={C.ink} />
          <rect x="1006" y="458" width="58" height="32" rx="4" fill={C.ocean} stroke={C.ink} strokeWidth="2" />
          <rect x="1012" y="476" width="26" height="4" rx="2" fill={C.paper} />
          {[
            [1006, 496, C.leaf],
            [1037, 496, C.ice],
            [1006, 532, C.sun],
            [1037, 532, C.flame],
          ].map(([x, y, c]) => (
            <g key={`${x}-${y}`}>
              <rect x={x} y={y} width="27" height="24" rx="3" fill={c as string} stroke={C.ink} strokeWidth="1.8" />
              <rect x={x} y={(y as number) + 28} width="18" height="3" rx="1.5" fill={C.muted} />
            </g>
          ))}
          <line x1="1004" y1="568" x2="1066" y2="568" stroke="#dbe3ee" strokeWidth="1.5" />
          {[1014, 1028, 1042, 1056].map((x, i) => (
            <circle key={x} cx={x} cy="575" r="2.6" fill={i === 0 ? C.flame : C.ink} />
          ))}
        </g>

        {/* Coffee mug */}
        <g transform={at(p.mug)}>
          <path d="M1202 546 q28 0 28 22 q0 22 -28 22" fill="none" stroke={C.ink} strokeWidth="13" strokeLinecap="round" />
          <path d="M1202 546 q28 0 28 22 q0 22 -28 22" fill="none" stroke={C.paper} strokeWidth="6.5" strokeLinecap="round" />
          <path d="M1118 528 h84 v62 q0 22 -22 22 h-40 q-22 0 -22 -22 z" fill={C.paper} {...ink} />
          <rect x="1118" y="562" width="84" height="12" fill={C.ocean} stroke={C.ink} strokeWidth="2" />
          <text x="1160" y="555" textAnchor="middle" className="font-marker" fontSize={22} fill={C.flame}>
            R.
          </text>
          <ellipse cx="1160" cy="528" rx="42" ry="7" fill={C.coffee} {...ink} />
        </g>

        {/* Plant */}
        <g transform={at(p.plant)}>
          {LEAVES.map((l) => (
            <g key={l.tip.join()}>
              <path d={leaf(LEAF_BASE, l.tip, l.w)} fill={l.fill} {...ink} strokeWidth={2.5} />
              <path d={`M${LEAF_BASE[0]} ${LEAF_BASE[1]} L${l.tip[0]} ${l.tip[1]}`} stroke={C.ink} strokeWidth="1.5" opacity="0.55" />
            </g>
          ))}
          <path d="M1280 540 L1380 540 L1368 612 L1292 612 Z" fill={C.paper} {...ink} />
          <path d="M1284 566 L1376 566 L1374 580 L1286 580 Z" fill={C.flame} stroke={C.ink} strokeWidth="2" />
          <rect x="1272" y="527" width="116" height="17" rx="4" fill={C.ocean} {...ink} />
        </g>
      </g>

      {/* Moving bits: kept out of the filtered layer */}
      <g transform={at(p.laptop)}>
        <rect x={CARET.x} y={CARET.y} width="3" height="10" fill="#e8f0fa" className="caret" />
      </g>
      <g transform={at(p.mug)}>
        {[1140, 1160, 1180].map((x, i) => (
          <path
            key={x}
            d={`M${x} 514 q-10 -14 0 -26 q10 -12 0 -24`}
            fill="none"
            stroke={C.steam}
            strokeWidth="4"
            strokeLinecap="round"
            className="steam"
            style={{ animationDelay: `${i * 0.7}s` }}
          />
        ))}
      </g>
    </svg>
  );
};
