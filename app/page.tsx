"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { HeroBanner } from "@/components/HeroBanner";
import { CategoryFilter } from "@/components/CategoryFilter";
import { SearchAndSort } from "@/components/SearchAndSort";
import { WishGrid } from "@/components/WishGrid";
import { NewWishModal } from "@/components/NewWishModal";
import { EditWishModal } from "@/components/EditWishModal";
import { WishDetailModal } from "@/components/WishDetailModal";
import { GrantedCelebration } from "@/components/GrantedCelebration";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Board Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Playful Hero Banner */}
        <HeroBanner />

        {/* Category Pill Filters */}
        <CategoryFilter />

        {/* Search, Status & Sort Bar */}
        <SearchAndSort />

        {/* Wish Cards Grid */}
        <WishGrid />
      </main>

      {/* Interactive Modals & Celebrations */}
      <NewWishModal />
      <EditWishModal />
      <WishDetailModal />
      <GrantedCelebration />

      {/* Footer */}
      <Footer />
    </div>
  );
}
