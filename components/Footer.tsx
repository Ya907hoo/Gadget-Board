"use client";

import React from "react";
import { GoldenBellIcon, MiniPropellerIcon, PocketPouchIcon } from "./DoraemonIcons";
import { Heart, Github, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-doraemon-cream-border bg-white/70 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Left Branding & homage notice */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-doraemon-blue flex items-center justify-center text-white shadow-sm">
            <PocketPouchIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="font-heading font-black text-sm text-doraemon-charcoal flex items-center justify-center md:justify-start gap-1.5">
              <span>Gadget Board</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-doraemon-yellow text-doraemon-charcoal font-bold">
                22nd-Century Edition
              </span>
            </p>
            <p className="text-xs text-doraemon-charcoal-muted mt-0.5">
              A playful anime-inspired collaborative idea board. Built with original palette & geometric motifs.
            </p>
          </div>
        </div>

        {/* Tech Stack Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-doraemon-charcoal-muted">
          <span className="px-2.5 py-1 rounded-full bg-doraemon-cream border border-doraemon-cream-border">
            Next.js App Router
          </span>
          <span className="px-2.5 py-1 rounded-full bg-doraemon-cream border border-doraemon-cream-border">
            Tailwind CSS
          </span>
          <span className="px-2.5 py-1 rounded-full bg-doraemon-cream border border-doraemon-cream-border">
            Framer Motion
          </span>
          <span className="px-2.5 py-1 rounded-full bg-doraemon-cream border border-doraemon-cream-border">
            Supabase Postgres & Realtime
          </span>
        </div>

        {/* Right side tribute */}
        <div className="text-xs text-doraemon-charcoal-muted flex items-center justify-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-doraemon-red fill-doraemon-red" />
          <span>for curious dreamers & inventors.</span>
        </div>
      </div>
    </footer>
  );
}
