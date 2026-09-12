"use client";

import React from "react";
import { useApp } from "@/lib/context";
import { GoldenBellIcon, PocketPouchIcon } from "./DoraemonIcons";
import { FuturisticSkylineSilhouette } from "./DoraemonMascot";
import { Mascot } from "./Mascot";
import { motion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";

export function HeroBanner() {
  const { wishes, setIsNewWishModalOpen, setStatus, status } = useApp();

  const totalWishes = wishes.length;
  const grantedCount = wishes.filter((w) => w.status === "granted").length;
  const totalUpvotes = wishes.reduce((sum, w) => sum + (w.upvotes_count || 0), 0);

  const stats = [
    {
      value: totalWishes,
      label: "Wishes Shared",
      icon: <PocketPouchIcon className="w-5 h-5 text-doraemon-blue-character" />,
      bg: "bg-[#DCF0FD]",
      chip: "bg-[#B4E0FA]",
    },
    {
      value: grantedCount,
      label: "Wishes Granted",
      icon: <GoldenBellIcon className="w-5 h-5" />,
      bg: "bg-[#FFF3C4]",
      chip: "bg-[#FFE27A]",
    },
    {
      value: totalUpvotes,
      label: "Upvotes Cast",
      icon: <Heart className="w-4 h-4 fill-doraemon-red-character text-doraemon-red-character" />,
      bg: "bg-[#FFE1E3]",
      chip: "bg-[#FFC2C6]",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#CFEBFC] via-[#E8F6FF] to-[#FFF3C4] border-3 border-ink shadow-ink-xl mb-10">
      {/* Halftone dot field */}
      <div className="absolute inset-0 halftone text-doraemon-blue-character opacity-[0.18] pointer-events-none" />

      {/* Skyline along the bottom */}
      <div className="absolute inset-x-0 bottom-0 h-40 text-doraemon-blue-deep opacity-20 pointer-events-none">
        <FuturisticSkylineSilhouette />
      </div>

      {/* Drifting clouds */}
      <div className="absolute top-6 left-[22%] w-36 h-14 bg-white/80 rounded-full blur-[2px] pointer-events-none animate-drift-x" />
      <div className="absolute top-20 right-[14%] w-28 h-12 bg-white/70 rounded-full blur-[2px] pointer-events-none animate-drift-x" style={{ animationDelay: "3s" }} />

      <div className="relative z-10 p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left: copy + actions */}
          <div className="flex-1 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border-3 border-ink shadow-ink-xs text-ink text-[11px] font-display font-extrabold uppercase tracking-wide">
              <span className="text-doraemon-yellow-gold">✦</span>
              <span>22nd-Century Idea Board</span>
            </div>

            <h2 className="mt-4 font-display font-extrabold text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.05] tracking-tight text-ink">
              Dream a Gadget,
              <br />
              <span className="text-doraemon-blue-character text-outline">Grant a Wish!</span>
            </h2>

            <p className="mt-4 text-sm text-ink-soft leading-relaxed max-w-lg font-medium">
              What everyday problem or impossible fantasy do you want solved? Post it to the shared
              4D board, rally upvotes, and brainstorm the perfect secret gadget to make it real.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <motion.button
                whileHover={{ x: -2, y: -2 }}
                whileTap={{ x: 2, y: 2 }}
                onClick={() => setIsNewWishModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-doraemon-blue-character text-white font-display font-extrabold text-sm border-3 border-ink shadow-ink hover:shadow-ink-lg active:shadow-ink-press transition-shadow"
              >
                <PocketPouchIcon className="w-4 h-4 text-white" />
                <span>Submit a Wish</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </motion.button>

              <motion.button
                whileHover={{ x: -2, y: -2 }}
                whileTap={{ x: 2, y: 2 }}
                onClick={() => setStatus(status === "granted" ? "all" : "granted")}
                className={`flex items-center gap-2 px-5 py-3 rounded-full font-display font-extrabold text-sm border-3 border-ink shadow-ink hover:shadow-ink-lg active:shadow-ink-press transition-shadow ${
                  status === "granted"
                    ? "bg-doraemon-yellow-bell text-ink"
                    : "bg-white text-ink"
                }`}
              >
                <GoldenBellIcon className="w-4 h-4" />
                <span>{status === "granted" ? "Showing Granted" : "Show Granted"}</span>
              </motion.button>
            </div>
          </div>

          {/* Centre: the character */}
          <div className="flex-shrink-0 flex items-center justify-center relative">
            <div className="absolute inset-0 speed-lines rounded-full scale-125 opacity-70 pointer-events-none" />
            <div className="animate-bob">
              <Mascot slot="hero" className="w-56 h-72 sm:w-64 sm:h-80 drop-shadow-xl" />
            </div>

            <div className="speech-bubble absolute -top-1 -right-2 sm:right-0 px-3 py-1.5 rotate-6">
              <p className="text-[11px] font-display font-extrabold text-ink leading-tight">
                Anything is possible!
              </p>
            </div>
          </div>

          {/* Right: stat stickers */}
          <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-44 shrink-0 justify-center">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 260, damping: 18 }}
                className={`flex-1 lg:flex-initial ${s.bg} rounded-2xl p-3.5 border-3 border-ink shadow-ink-sm flex flex-col items-center justify-center text-center`}
              >
                <div className={`w-9 h-9 rounded-full ${s.chip} border-2 border-ink flex items-center justify-center mb-1.5`}>
                  {s.icon}
                </div>
                <span className="text-3xl font-display font-extrabold text-ink leading-none">
                  {s.value}
                </span>
                <span className="text-[10px] font-display font-bold text-ink-soft mt-1 uppercase tracking-wide">
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
