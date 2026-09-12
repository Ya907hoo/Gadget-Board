"use client";

import React from "react";
import { useApp } from "@/lib/context";
import { WishCard } from "./WishCard";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { EmptyState } from "./EmptyState";
import { AnimatePresence, LayoutGroup } from "framer-motion";

export function WishGrid() {
  const { wishes, isLoading, isRefreshing } = useApp();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (wishes.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="relative">
      {/* Subtle refreshing top indicator */}
      {isRefreshing && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-doraemon-blue text-white text-[11px] font-bold shadow-md animate-pulse z-10">
          Syncing board...
        </div>
      )}

      <LayoutGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {wishes.map((wish, index) => (
              <WishCard key={wish.id} wish={wish} index={index} />
            ))}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </div>
  );
}
