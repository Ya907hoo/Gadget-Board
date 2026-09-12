"use client";

import React from "react";
import { useApp } from "@/lib/context";
import { GoldenBellIcon, MagicSparkleIcon, MiniPropellerIcon, PocketPouchIcon } from "./DoraemonIcons";
import { motion } from "framer-motion";
import { Sparkles, Heart, CheckCircle2, ArrowRight } from "lucide-react";

export function HeroBanner() {
  const { wishes, setIsNewWishModalOpen, setStatus, status } = useApp();

  const totalWishes = wishes.length;
  const grantedCount = wishes.filter((w) => w.status === "granted").length;
  const totalUpvotes = wishes.reduce((sum, w) => sum + (w.upvotes_count || 0), 0);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-doraemon-cream-border p-6 sm:p-10 shadow-doraemon-card mb-8">
      {/* Decorative background motifs */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-doraemon-blue-light/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-doraemon-yellow-light/50 rounded-full blur-2xl pointer-events-none -mb-20"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl text-center lg:text-left">
          {/* Whimsical Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-doraemon-blue-light text-doraemon-blue-dark text-xs font-bold mb-4 border border-doraemon-blue/20"
          >
            <MagicSparkleIcon className="w-4 h-4 text-doraemon-yellow-gold" />
            <span>22nd-Century Collaborative Idea Board</span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-doraemon-charcoal tracking-tight leading-tight"
          >
            Dream a Gadget,{" "}
            <span className="text-doraemon-blue relative inline-block">
              Grant a Wish!
              {/* Pocket pouch underline accent */}
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-doraemon-yellow"
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
              >
                <path d="M0 10 Q50 20 100 10" stroke="#FFD447" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-sm sm:text-base text-doraemon-charcoal-muted leading-relaxed"
          >
            What everyday problem or impossible fantasy do you want solved? Post your wish to the shared 4D idea board, rally upvotes from friends, and brainstorm magical secret gadget solutions to grant it!
          </motion.p>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsNewWishModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-doraemon-blue hover:bg-doraemon-blue-hover text-white font-heading font-bold text-sm shadow-doraemon-hover transition-all"
            >
              <PocketPouchIcon className="w-5 h-5 text-white" />
              <span>Submit a Wish Idea</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setStatus(status === "granted" ? "all" : "granted")}
              className={`flex items-center gap-2 px-5 py-3 rounded-full font-heading font-bold text-sm transition-all border ${
                status === "granted"
                  ? "bg-doraemon-yellow text-doraemon-charcoal border-doraemon-yellow-dark shadow-doraemon-gold"
                  : "bg-white text-doraemon-charcoal border-doraemon-cream-border hover:bg-doraemon-cream"
              }`}
            >
              <GoldenBellIcon className="w-4 h-4" />
              <span>{status === "granted" ? "Showing Granted" : "View Granted Gadgets"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Playful Stats Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 sm:gap-4 w-full lg:w-auto shrink-0"
        >
          {/* Stat 1: Total Wishes */}
          <div className="bg-doraemon-cream rounded-3xl p-4 sm:p-5 border border-doraemon-cream-border flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-doraemon-blue-light flex items-center justify-center text-doraemon-blue mb-2">
              <PocketPouchIcon className="w-6 h-6" />
            </div>
            <span className="text-2xl sm:text-3xl font-heading font-extrabold text-doraemon-charcoal">
              {totalWishes}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-doraemon-charcoal-muted mt-0.5">
              Wishes Shared
            </span>
          </div>

          {/* Stat 2: Granted Wishes */}
          <div className="bg-doraemon-yellow-light/60 rounded-3xl p-4 sm:p-5 border border-doraemon-yellow/40 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-doraemon-yellow/40 flex items-center justify-center text-doraemon-yellow-dark mb-2">
              <GoldenBellIcon className="w-5 h-5" />
            </div>
            <span className="text-2xl sm:text-3xl font-heading font-extrabold text-doraemon-charcoal">
              {grantedCount}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-doraemon-charcoal-muted mt-0.5">
              Wishes Granted
            </span>
          </div>

          {/* Stat 3: Total Upvotes */}
          <div className="bg-doraemon-red-light/60 rounded-3xl p-4 sm:p-5 border border-doraemon-red/30 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-2xl bg-doraemon-red/20 flex items-center justify-center text-doraemon-red mb-2">
              <Heart className="w-5 h-5 fill-doraemon-red text-doraemon-red" />
            </div>
            <span className="text-2xl sm:text-3xl font-heading font-extrabold text-doraemon-charcoal">
              {totalUpvotes}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-doraemon-charcoal-muted mt-0.5">
              Upvotes Cast
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
