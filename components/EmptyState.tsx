"use client";

import React from "react";
import { useApp } from "@/lib/context";
import { MagicSparkleIcon, MiniPropellerIcon, PocketPouchIcon } from "./DoraemonIcons";
import { motion } from "framer-motion";
import { Plus, RefreshCw } from "lucide-react";

export function EmptyState() {
  const {
    search,
    setSearch,
    status,
    setStatus,
    category,
    setCategory,
    setIsNewWishModalOpen,
  } = useApp();

  const isFiltered = search !== "" || status !== "all" || category !== "All";

  const handleReset = () => {
    setSearch("");
    setStatus("all");
    setCategory("All");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center p-8 sm:p-14 bg-white/80 rounded-4xl border-2 border-dashed border-doraemon-blue/20 my-8 shadow-sm"
    >
      {/* Floating 4D Pocket & Propeller Animation */}
      <motion.div
        animate={{
          y: [-8, 8, -8],
          rotate: [-2, 2, -2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-28 h-28 mb-6 flex items-center justify-center"
      >
        <div className="w-24 h-24 rounded-3xl bg-doraemon-blue-light border-2 border-doraemon-blue flex items-center justify-center shadow-doraemon-card">
          <PocketPouchIcon className="w-14 h-14 text-doraemon-blue" />
        </div>

        {/* Floating bamboo copter above */}
        <div className="absolute -top-3 right-0">
          <MiniPropellerIcon className="w-8 h-8" animated />
        </div>

        {/* Magic sparkles floating */}
        <div className="absolute -bottom-2 -left-2">
          <MagicSparkleIcon className="w-6 h-6 text-doraemon-yellow-gold" />
        </div>
      </motion.div>

      {/* Friendly Copy */}
      <h3 className="text-xl sm:text-2xl font-heading font-black text-doraemon-charcoal mb-2">
        {isFiltered ? "No Matching Wishes Found!" : "The 4D Pocket is Waiting for Your Wish!"}
      </h3>
      <p className="text-sm text-doraemon-charcoal-muted max-w-md mb-6 leading-relaxed">
        {isFiltered
          ? "We searched far and wide through time and space, but couldn't find any wishes matching your current filters."
          : "Be the very first to ask Doraemon for a miraculous 22nd-century gadget. What dream or everyday puzzle needs solving?"}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {isFiltered ? (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-doraemon-cream-border hover:border-doraemon-blue font-heading font-bold text-xs sm:text-sm text-doraemon-charcoal transition-all shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-doraemon-blue" />
            <span>Reset Search & Filters</span>
          </button>
        ) : null}

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setIsNewWishModalOpen(true)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-doraemon-red hover:bg-doraemon-red-hover font-heading font-bold text-xs sm:text-sm text-white shadow-doraemon-red transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Post the First Wish!</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
