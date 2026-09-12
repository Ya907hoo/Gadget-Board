/* ------------------------------------------------------------------ *
 * Mascot source configuration
 *
 * Every place the character appears renders through <Mascot slot="..." />.
 * By default each slot draws the built-in SVG artwork.
 *
 * TO USE YOUR OWN IMAGE FILES:
 *   1. Drop the files into  public/doraemon/
 *   2. Set the matching slot below to its public path, e.g.
 *         head: "/doraemon/head.png"
 *   3. That's it — no component changes needed.
 *
 * Set a slot back to null to return to the built-in SVG.
 *
 * Note: only ship artwork you have the rights to use. Doraemon is a
 * registered character of Fujiko Pro / Shogakukan, so official art is
 * not bundled with this project.
 * ------------------------------------------------------------------ */

export type MascotSlot = "head" | "hero" | "peek";

export const MASCOT_SOURCES: Record<MascotSlot, string | null> = {
  /** Small circular head — navbar logo, card badges, buttons. */
  head: null,
  /** Large full-body figure — hero banner. */
  hero: null,
  /** Head + paws peeking over the bottom edge of the screen. */
  peek: null,
};

/** Sensible alt text per slot, used when an image source is supplied. */
export const MASCOT_ALT: Record<MascotSlot, string> = {
  head: "Doraemon",
  hero: "Doraemon flying with a bamboo-copter",
  peek: "Doraemon peeking over the edge",
};
