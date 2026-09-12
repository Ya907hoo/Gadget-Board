"use client";

import React from "react";
import { useApp } from "@/lib/context";
import { CATEGORIES } from "@/lib/validation";
import { WishCategory } from "@/lib/types";
import { motion } from "framer-motion";
import {
  Smile,
  BookOpen,
  Compass,
  Zap,
  Utensils,
  Star,
  Layers,
} from "lucide-react";

export function CategoryFilter() {
  const { category, setCategory, wishes } = useApp();

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Daily Life":
        return <Smile className="w-4 h-4 text-blue-500" />;
      case "Study & School":
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case "Travel & Time":
        return <Compass className="w-4 h-4 text-blue-500" />;
      case "Secret Gadgets":
        return <Zap className="w-4 h-4 text-blue-500" />;
      case "Food & Dorayaki":
        return <Utensils className="w-4 h-4 text-blue-500" />;
      case "Fun & Mischief":
        return <Star className="w-4 h-4 text-blue-500" />;
      default:
        return <Layers className="w-4 h-4 text-white" />;
    }
  };

  const getCount = (cat: string) => {
    if (cat === "All") return wishes.length;
    return wishes.filter((w) => w.category === cat).length;
  };

  const allTabs: (WishCategory | "All")[] = ["All", ...CATEGORIES];

  return (
    <div className="mb-5 overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2.5 min-w-max">
        {allTabs.map((cat) => {
          const isSelected = category === cat;
          const count = getCount(cat);

          return (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-heading font-extrabold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-sm ${
                isSelected
                  ? "bg-[#0A84FF] text-white shadow-blue-200 border-2 border-transparent"
                  : "bg-white text-slate-700 hover:bg-sky-50 border border-sky-200/80"
              }`}
            >
              <span className={isSelected ? "text-white" : ""}>
                {cat === "All" ? <Layers className="w-4 h-4 text-white" /> : getCategoryIcon(cat)}
              </span>
              <span>{cat}</span>
              <span
                className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                  isSelected ? "bg-white/30 text-white" : "text-slate-400"
                }`}
              >
                {count}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
