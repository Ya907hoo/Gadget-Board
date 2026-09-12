"use client";

import React from "react";
import { useApp } from "@/lib/context";
import { CATEGORIES } from "@/lib/validation";
import { WishCategory } from "@/lib/types";
import { motion } from "framer-motion";
import {
  Sparkles,
  BookOpen,
  Compass,
  Zap,
  Utensils,
  Smile,
  Layers,
} from "lucide-react";

export function CategoryFilter() {
  const { category, setCategory, wishes } = useApp();

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Daily Life":
        return <Smile className="w-4 h-4" />;
      case "Study & School":
        return <BookOpen className="w-4 h-4" />;
      case "Travel & Time":
        return <Compass className="w-4 h-4" />;
      case "Secret Gadgets":
        return <Zap className="w-4 h-4" />;
      case "Food & Dorayaki":
        return <Utensils className="w-4 h-4" />;
      case "Fun & Mischief":
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  const getCount = (cat: string) => {
    if (cat === "All") return wishes.length;
    return wishes.filter((w) => w.category === cat).length;
  };

  const allTabs: (WishCategory | "All")[] = ["All", ...CATEGORIES];

  return (
    <div className="mb-6 overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max">
        {allTabs.map((cat) => {
          const isSelected = category === cat;
          const count = getCount(cat);

          return (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setCategory(cat)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full font-heading font-bold text-xs sm:text-sm transition-colors duration-200 cursor-pointer ${
                isSelected
                  ? "bg-doraemon-blue text-white shadow-doraemon-card"
                  : "bg-white text-doraemon-charcoal hover:bg-doraemon-cream border border-doraemon-cream-border"
              }`}
            >
              <span className={isSelected ? "text-white" : "text-doraemon-blue"}>
                {getCategoryIcon(cat)}
              </span>
              <span>{cat}</span>
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${
                  isSelected
                    ? "bg-white/25 text-white"
                    : "bg-doraemon-cream text-doraemon-charcoal-muted"
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
