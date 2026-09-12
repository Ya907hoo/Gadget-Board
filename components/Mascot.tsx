import React from "react";
import { MASCOT_SOURCES, MASCOT_ALT, type MascotSlot } from "@/lib/mascot-config";
import {
  DoraemonHeadIcon,
  FlyingDoraemon,
  PeekingDoraemon,
  type DoraExpression,
} from "./DoraemonMascot";

interface MascotProps {
  slot: MascotSlot;
  className?: string;
  /** Only applies to the built-in SVG artwork; ignored for image sources. */
  expression?: DoraExpression;
}

/**
 * Renders the mascot for a given slot.
 *
 * Draws the built-in SVG unless a path is configured for that slot in
 * lib/mascot-config.ts, in which case it renders that image instead.
 */
export function Mascot({ slot, className = "", expression }: MascotProps) {
  const src = MASCOT_SOURCES[slot];

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={MASCOT_ALT[slot]}
        className={`object-contain select-none ${className}`}
        draggable={false}
        loading={slot === "hero" ? "eager" : "lazy"}
      />
    );
  }

  switch (slot) {
    case "hero":
      return <FlyingDoraemon className={className} expression={expression ?? "joy"} />;
    case "peek":
      return <PeekingDoraemon className={className} />;
    case "head":
    default:
      return <DoraemonHeadIcon className={className} expression={expression ?? "smile"} />;
  }
}

/**
 * The mascot peeking over the bottom-left corner of the viewport,
 * with a speech bubble. Hidden on small screens so it never covers
 * content on mobile.
 */
export function PeekingDoraemonCorner({ message }: { message?: string }) {
  return (
    <div className="hidden lg:flex fixed bottom-0 left-5 z-30 pointer-events-none items-end">
      <div className="relative">
        <div className="speech-bubble absolute -top-16 left-12 px-3.5 py-2 w-max animate-float">
          <p className="text-[11px] font-display font-extrabold text-doraemon-blue-character leading-tight">
            Small ideas
          </p>
          <p className="text-[10px] font-bold text-ink-soft leading-tight">
            {message ?? "can make a big difference!"}
          </p>
        </div>

        <Mascot slot="peek" className="w-28 h-[5.25rem]" />
      </div>
    </div>
  );
}
