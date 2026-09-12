"use client";

import React from "react";
import { useApp } from "@/lib/context";
import { SortFilter, StatusFilter } from "@/lib/types";
import { Search, X, SlidersHorizontal, Flame, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function SearchAndSort() {
  const {
    search,
    setSearch,
    status,
    setStatus,
    sort,
    setSort,
    category,
    setCategory,
  } = useApp();

  const isFiltered = search !== "" || status !== "all" || category !== "All";

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 bg-white/70 p-4 rounded-3xl border border-doraemon-cream-border shadow-sm">
      {/* Search Bar */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-doraemon-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search wishes, gadget ideas, keywords..."
          className="w-full pl-10 pr-10 py-2.5 rounded-full bg-doraemon-cream border border-doraemon-cream-border focus:border-doraemon-blue focus:ring-2 focus:ring-doraemon-blue-light focus:outline-none text-sm text-doraemon-charcoal placeholder:text-doraemon-charcoal-muted transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-doraemon-charcoal-muted hover:text-doraemon-charcoal"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Controls Group: Status Filter & Sort Dropdown */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Segment */}
        <div className="inline-flex rounded-full bg-doraemon-cream p-1 border border-doraemon-cream-border">
          <button
            onClick={() => setStatus("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-heading font-bold transition-all ${
              status === "all"
                ? "bg-white text-doraemon-blue shadow-sm"
                : "text-doraemon-charcoal-muted hover:text-doraemon-charcoal"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatus("open")}
            className={`px-3 py-1.5 rounded-full text-xs font-heading font-bold transition-all ${
              status === "open"
                ? "bg-white text-doraemon-blue shadow-sm"
                : "text-doraemon-charcoal-muted hover:text-doraemon-charcoal"
            }`}
          >
            Active Wishes
          </button>
          <button
            onClick={() => setStatus("granted")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-heading font-bold transition-all ${
              status === "granted"
                ? "bg-doraemon-yellow text-doraemon-charcoal shadow-sm"
                : "text-doraemon-charcoal-muted hover:text-doraemon-charcoal"
            }`}
          >
            <span>Granted</span>
            <Sparkles className="w-3 h-3 text-amber-600" />
          </button>
        </div>

        {/* Sort Selector */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortFilter)}
            className="appearance-none pl-4 pr-9 py-2 rounded-full bg-white border border-doraemon-cream-border text-xs font-heading font-bold text-doraemon-charcoal hover:border-doraemon-blue focus:outline-none focus:ring-2 focus:ring-doraemon-blue-light cursor-pointer shadow-sm"
          >
            <option value="upvotes">🔥 Most Upvoted</option>
            <option value="newest">🕒 Newest First</option>
            <option value="oldest">⏳ Oldest First</option>
          </select>
          <SlidersHorizontal className="w-3.5 h-3.5 text-doraemon-charcoal-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Clear Filters Button */}
        {isFiltered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => {
              setSearch("");
              setStatus("all");
              setCategory("All");
            }}
            className="px-3 py-2 rounded-full text-xs font-semibold text-doraemon-red hover:bg-doraemon-red-light transition-colors"
          >
            Reset Filters
          </motion.button>
        )}
      </div>
    </div>
  );
}
