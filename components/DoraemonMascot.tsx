import React from "react";

/* ------------------------------------------------------------------ *
 * Doraemon vector artwork — original, hand-authored SVG.
 *
 * All figures are built from one shared face group defined in a
 * 200x200 coordinate space, then placed with <g transform>. That keeps
 * proportions identical everywhere the character appears.
 *
 * Proportion notes (what makes it read as Doraemon):
 *  - The white face is huge: it covers the head almost entirely,
 *    leaving only a blue crescent at the top and thin blue rims.
 *  - The eyes are tall vertical ovals that TOUCH at the centre line,
 *    and their tops push up past the white face edge.
 *  - The head dominates the body; limbs are short, hands/feet are
 *    simple white circles.
 * ------------------------------------------------------------------ */

export const DORA = {
  ink: "#17222E",
  blue: "#00A0E9",
  blueDeep: "#0077B6",
  red: "#E4262C",
  redDeep: "#B81B21",
  yellow: "#FFD100",
  yellowDeep: "#E0A800",
  white: "#FFFFFF",
  tongue: "#FF8FA3",
} as const;

export type DoraExpression = "smile" | "joy" | "wink";

/* ---------------------------- face ---------------------------- */
/* Drawn in a 200x200 box. Head centre (100,88) r=80. */

function DoraFace({ expression = "smile" }: { expression?: DoraExpression }) {
  return (
    <>
      {/* Blue head */}
      <circle cx="100" cy="88" r="80" fill={DORA.blue} stroke={DORA.ink} strokeWidth="4" />
      {/* Soft sheen on the blue crown */}
      <ellipse cx="72" cy="34" rx="26" ry="13" fill={DORA.white} opacity="0.28" transform="rotate(-22 72 34)" />

      {/* White face — large, sits low, leaves a blue crescent up top */}
      <ellipse cx="100" cy="104" rx="70" ry="63" fill={DORA.white} stroke={DORA.ink} strokeWidth="3.5" />

      {/* Whiskers: three per side, angled outward */}
      <g stroke={DORA.ink} strokeWidth="3.2" strokeLinecap="round">
        <line x1="18" y1="73" x2="60" y2="81" />
        <line x1="14" y1="93" x2="58" y2="93" />
        <line x1="18" y1="113" x2="60" y2="104" />
        <line x1="182" y1="73" x2="140" y2="81" />
        <line x1="186" y1="93" x2="142" y2="93" />
        <line x1="182" y1="113" x2="140" y2="104" />
      </g>

      {/* Mouth */}
      {expression === "joy" ? (
        <>
          <path
            d="M52 112 Q100 168 148 112 Z"
            fill={DORA.red}
            stroke={DORA.ink}
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <ellipse cx="100" cy="133" rx="20" ry="6" fill={DORA.tongue} />
        </>
      ) : (
        <path
          d="M48 113 Q100 157 152 113"
          fill="none"
          stroke={DORA.ink}
          strokeWidth="3.8"
          strokeLinecap="round"
        />
      )}

      {/* Vertical line from nose down to the mouth */}
      <line x1="100" y1="97" x2="100" y2="121" stroke={DORA.ink} strokeWidth="3.4" strokeLinecap="round" />

      {/* Eyes — tall ovals touching at the centre line */}
      {expression === "wink" ? (
        <>
          <path
            d="M70 56 Q84.5 42 99 56"
            fill="none"
            stroke={DORA.ink}
            strokeWidth="4.2"
            strokeLinecap="round"
          />
          <ellipse cx="115.5" cy="48" rx="15.5" ry="21" fill={DORA.white} stroke={DORA.ink} strokeWidth="3.2" />
          <ellipse cx="111" cy="55" rx="4.8" ry="6.8" fill={DORA.ink} />
          <circle cx="112.6" cy="51" r="2" fill={DORA.white} />
        </>
      ) : (
        <>
          <ellipse cx="84.5" cy="48" rx="15.5" ry="21" fill={DORA.white} stroke={DORA.ink} strokeWidth="3.2" />
          <ellipse cx="115.5" cy="48" rx="15.5" ry="21" fill={DORA.white} stroke={DORA.ink} strokeWidth="3.2" />
          <ellipse cx="89" cy="55" rx="4.8" ry="6.8" fill={DORA.ink} />
          <ellipse cx="111" cy="55" rx="4.8" ry="6.8" fill={DORA.ink} />
          <circle cx="90.6" cy="51" r="2" fill={DORA.white} />
          <circle cx="112.6" cy="51" r="2" fill={DORA.white} />
        </>
      )}

      {/* Red nose */}
      <circle cx="100" cy="86" r="11.5" fill={DORA.red} stroke={DORA.ink} strokeWidth="3.2" />
      <circle cx="96" cy="82" r="4" fill={DORA.white} opacity="0.9" />
    </>
  );
}

/* Collar + bell, same 200x200 space, drawn after the body. */
function DoraCollar({ bellRadius = 14 }: { bellRadius?: number }) {
  return (
    <>
      <rect x="26" y="157" width="148" height="15" rx="7.5" fill={DORA.red} stroke={DORA.ink} strokeWidth="3.2" />
      <circle cx="100" cy="181" r={bellRadius} fill={DORA.yellow} stroke={DORA.ink} strokeWidth="3" />
      <line x1={100 - bellRadius * 0.78} y1="176" x2={100 + bellRadius * 0.78} y2="176" stroke={DORA.ink} strokeWidth="2.2" />
      <circle cx="100" cy="185" r="3.4" fill={DORA.ink} />
      <line x1="100" y1="188" x2="100" y2="194" stroke={DORA.ink} strokeWidth="2.6" strokeLinecap="round" />
    </>
  );
}

/* ------------------------ head-only icon ------------------------ */

export function DoraemonHeadIcon({
  className = "w-10 h-10",
  expression = "smile",
}: {
  className?: string;
  expression?: DoraExpression;
}) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <DoraFace expression={expression} />
      <DoraCollar />
    </svg>
  );
}

/* --------------------- full figure, flying --------------------- */

export function FlyingDoraemon({
  className = "w-72 h-72",
  expression = "joy",
}: {
  className?: string;
  expression?: DoraExpression;
}) {
  return (
    <svg
      viewBox="0 0 300 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Doraemon flying with a bamboo-copter"
      role="img"
    >
      {/* ---------- bamboo-copter ---------- */}
      {/* spin blur arcs */}
      <path d="M92 20 Q150 6 208 20" fill="none" stroke={DORA.yellowDeep} strokeWidth="2" opacity="0.35" strokeLinecap="round" />
      <path d="M96 34 Q150 46 204 34" fill="none" stroke={DORA.yellowDeep} strokeWidth="2" opacity="0.25" strokeLinecap="round" />
      {/* blades */}
      <path d="M150 26 C120 14 90 16 86 24 C84 30 116 32 150 30 Z" fill={DORA.yellow} stroke={DORA.ink} strokeWidth="3" strokeLinejoin="round" />
      <path d="M150 26 C180 14 210 16 214 24 C216 30 184 32 150 30 Z" fill={DORA.yellow} stroke={DORA.ink} strokeWidth="3" strokeLinejoin="round" />
      <circle cx="150" cy="28" r="6" fill={DORA.red} stroke={DORA.ink} strokeWidth="2.6" />
      {/* shaft */}
      <rect x="145.5" y="30" width="9" height="26" rx="4.5" fill={DORA.yellow} stroke={DORA.ink} strokeWidth="3" />
      {/* suction mount on the head */}
      <ellipse cx="150" cy="56" rx="14" ry="6.5" fill={DORA.ink} />

      {/* ---------- arms (behind the body) ---------- */}
      {/* left arm, raised in a wave */}
      <path d="M116 202 Q80 190 62 170" stroke={DORA.ink} strokeWidth="26" strokeLinecap="round" fill="none" />
      <path d="M116 202 Q80 190 62 170" stroke={DORA.blue} strokeWidth="19" strokeLinecap="round" fill="none" />
      {/* right arm, reaching out */}
      <path d="M184 202 Q220 196 240 180" stroke={DORA.ink} strokeWidth="26" strokeLinecap="round" fill="none" />
      <path d="M184 202 Q220 196 240 180" stroke={DORA.blue} strokeWidth="19" strokeLinecap="round" fill="none" />

      {/* ---------- body ---------- */}
      <path
        d="M110 190 C104 236 108 290 150 290 C192 290 196 236 190 190 Z"
        fill={DORA.blue}
        stroke={DORA.ink}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* white belly */}
      <ellipse cx="150" cy="258" rx="36" ry="31" fill={DORA.white} stroke={DORA.ink} strokeWidth="3.4" />
      {/* 4D pocket */}
      <path d="M124 256 A26 26 0 0 0 176 256 Z" fill={DORA.white} stroke={DORA.ink} strokeWidth="3.4" strokeLinejoin="round" />

      {/* ---------- feet ---------- */}
      <ellipse cx="118" cy="300" rx="28" ry="16" fill={DORA.white} stroke={DORA.ink} strokeWidth="3.4" />
      <ellipse cx="182" cy="300" rx="28" ry="16" fill={DORA.white} stroke={DORA.ink} strokeWidth="3.4" />

      {/* ---------- hands ---------- */}
      <circle cx="62" cy="170" r="19" fill={DORA.white} stroke={DORA.ink} strokeWidth="3.4" />
      <circle cx="240" cy="180" r="19" fill={DORA.white} stroke={DORA.ink} strokeWidth="3.4" />

      {/* ---------- head ---------- */}
      <g transform="translate(50, 40)">
        <DoraFace expression={expression} />
      </g>

      {/* ---------- collar + bell, last so they sit on top ---------- */}
      <g transform="translate(50, 40)">
        <DoraCollar bellRadius={13} />
      </g>
    </svg>
  );
}

/* --------------------- peeking over an edge --------------------- */

export function PeekingDoraemon({ className = "w-28 h-28" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Doraemon peeking"
      role="img"
    >
      {/* Head, cropped by the viewBox so only the top half shows */}
      <g transform="translate(0, 6)">
        <DoraFace expression="smile" />
      </g>
      {/* Paws hooked over the edge, drawn last so they sit in front */}
      <circle cx="26" cy="140" r="20" fill={DORA.white} stroke={DORA.ink} strokeWidth="3.4" />
      <circle cx="174" cy="140" r="20" fill={DORA.white} stroke={DORA.ink} strokeWidth="3.4" />
    </svg>
  );
}

/* ---------------------- Anywhere Door ---------------------- */

export function AnywhereDoor({ className = "w-24 h-32" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 170" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {/* door slab */}
      <rect x="10" y="10" width="100" height="150" rx="8" fill="#F5A9C5" stroke={DORA.ink} strokeWidth="4" />
      {/* inner panel */}
      <rect x="20" y="20" width="80" height="130" rx="5" fill="#FBC8DC" stroke={DORA.ink} strokeWidth="2.5" />
      {/* knob */}
      <circle cx="88" cy="92" r="8" fill={DORA.yellow} stroke={DORA.ink} strokeWidth="3" />
      {/* sparkle */}
      <path d="M38 46 L42 58 L54 62 L42 66 L38 78 L34 66 L22 62 L34 58 Z" fill={DORA.white} opacity="0.75" />
    </svg>
  );
}

/* ------------------ background: 22nd-century skyline ------------------ */

export function FuturisticSkylineSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1000 300"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <path
        d="M0 300L0 270Q30 250 60 270L80 250L90 190L100 140L105 110L110 140L120 190L130 250L160 270L190 230L205 180L215 160Q225 120 230 160L240 180L255 230L290 260L330 240L350 200L355 170L365 140L370 170L375 200L395 240L440 270L480 230L490 190L500 130L505 90L510 130L520 190L530 230L570 270L610 240L630 180L645 130L650 80L655 130L670 180L690 240L730 260L770 210L785 160L795 100L800 60L805 100L815 160L830 210L870 260L910 230L930 170L940 120L945 80L950 120L960 170L980 230L1000 270L1000 300Z"
        fill="currentColor"
      />
      <ellipse cx="260" cy="80" rx="24" ry="7" fill="currentColor" />
      <ellipse cx="260" cy="77" rx="10" ry="6" fill="currentColor" />
      <ellipse cx="850" cy="90" rx="30" ry="8" fill="currentColor" />
      <ellipse cx="850" cy="86" rx="12" ry="7" fill="currentColor" />
    </svg>
  );
}
