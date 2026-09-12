"use client";

import React from "react";
import { useApp } from "@/lib/context";
import { SortFilter } from "@/lib/types";
import { Search, X, SlidersHorizontal, RotateCcw, Sparkles } from "lucide-react";
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

  const handleReset = () => {
    setSearch("");
    setStatus("all");
    setCategory("All");
    setSort("upvotes");
  };

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-8 bg-white/90 backdrop-blur-sm p-3 rounded-full border border-sky-200/80 shadow-sm">
      {/* Search Input matching screenshot */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search wishes, gadget ideas, keywords..."
          className="w-full pl-11 pr-10 py-2 rounded-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Right Controls: Status Pills, Sort, Reset */}
      <div className="flex flex-wrap items-center gap-2 px-2">
        {/* Status Segment Pills matching screenshot */}
        <div className="flex items-center gap-1 bg-slate-100/70 p-1 rounded-full border border-slate-200/60">
          <button
            onClick={() => setStatus("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-heading font-extrabold transition-all cursor-pointer ${
              status === "all"
                ? "bg-white text-[#0A84FF] shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatus("open")}
            className={`px-3 py-1.5 rounded-full text-xs font-heading font-extrabold transition-all cursor-pointer ${
              status === "open"
                ? "bg-white text-[#0A84FF] shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Active Wishes
          </button>
          <button
            onClick={() => setStatus("granted")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-heading font-extrabold transition-all cursor-pointer ${
              status === "granted"
                ? "bg-[#FFD447] text-slate-800 shadow-sm border border-amber-300"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Granted</span>
            <Sparkles className="w-3 h-3 text-amber-600" />
          </button>
        </div>

        {/* Sort Selector matching screenshot */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortFilter)}
            className="appearance-none pl-3 pr-8 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-heading font-extrabold text-slate-700 hover:border-sky-400 focus:outline-none cursor-pointer shadow-sm"
          >
            <option value="upvotes">🔥 Most Upvoted</option>
            <option value="newest">🕒 Newest First</option>
            <option value="oldest">⏳ Oldest First</option>
          </select>
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Reset Filters matching screenshot */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-heading font-extrabold text-sky-700 hover:bg-sky-50 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-sky-600" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>
  );
}
