"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { GoldenBellIcon, MiniPropellerIcon, PersonaAvatarBadge, PocketPouchIcon } from "./DoraemonIcons";
import { USER_PERSONAS } from "@/lib/seed-data";
import { ChevronDown, Plus, Radio, Sparkles, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const {
    currentUser,
    setCurrentUser,
    isLiveConnected,
    lastLiveEvent,
    setIsNewWishModalOpen,
    wishes,
  } = useApp();

  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);

  const grantedCount = wishes.filter((w) => w.status === "granted").length;

  return (
    <header className="sticky top-0 z-40 bg-doraemon-cream/90 backdrop-blur-md border-b border-doraemon-cream-border shadow-doraemon-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-12 h-12 rounded-2xl bg-doraemon-blue flex items-center justify-center shadow-doraemon-card text-white relative transition-transform duration-300 group-hover:scale-105">
              <PocketPouchIcon className="w-8 h-8 text-white" />
              {/* Little red collar accent on bottom */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-doraemon-red rounded-full shadow-sm"></div>
            </div>
            {/* Whimsical mini bamboo copter floating on top */}
            <div className="absolute -top-3.5 -right-2 transform -rotate-12 group-hover:rotate-12 transition-transform duration-300">
              <MiniPropellerIcon className="w-6 h-6" animated />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-heading font-black text-doraemon-blue tracking-tight">
                Gadget Board
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-doraemon-yellow-light text-doraemon-charcoal border border-doraemon-yellow">
                <GoldenBellIcon className="w-3.5 h-3.5" />
                4D Pocket Edition
              </span>
            </div>
            <p className="text-xs text-doraemon-charcoal-muted font-medium hidden md:block">
              Collaborative 22nd-Century Idea & Wish Engine
            </p>
          </div>
        </div>

        {/* Right Section: Realtime Indicator, Persona Switcher & New Wish CTA */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Live Real-time Sync Indicator */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white border border-doraemon-cream-border text-xs font-semibold shadow-sm transition-all"
            title={isLiveConnected ? "Live real-time sync active across all tabs & sessions" : "Local session connected"}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="hidden sm:inline text-doraemon-charcoal-muted">
              {lastLiveEvent ? (
                <span className="text-doraemon-blue font-bold animate-pulse">{lastLiveEvent}</span>
              ) : (
                "Realtime Live"
              )}
            </span>
          </div>

          {/* User Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsPersonaMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-white border border-doraemon-cream-border hover:border-doraemon-blue hover:shadow-doraemon-sm transition-all text-left"
              aria-label="Switch User Persona"
            >
              <PersonaAvatarBadge avatarKey={currentUser.avatar} size="sm" />
              <div className="hidden md:block">
                <p className="text-xs font-bold text-doraemon-charcoal leading-none">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-doraemon-charcoal-muted leading-tight truncate max-w-[90px]">
                  {currentUser.role}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-doraemon-charcoal-muted ml-0.5" />
            </button>

            {/* Persona Dropdown Menu */}
            <AnimatePresence>
              {isPersonaMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsPersonaMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-xl border border-doraemon-cream-border p-2 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-2 border-b border-doraemon-cream-border mb-1">
                      <p className="text-xs font-bold text-doraemon-charcoal">
                        Switch Collaborative Persona
                      </p>
                      <p className="text-[11px] text-doraemon-charcoal-muted">
                        Test wish ownership, creator editing & voting permissions.
                      </p>
                    </div>

                    <div className="space-y-1">
                      {USER_PERSONAS.map((persona) => {
                        const isSelected = persona.id === currentUser.id;
                        return (
                          <button
                            key={persona.id}
                            onClick={() => {
                              setCurrentUser(persona);
                              setIsPersonaMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 p-2 rounded-2xl transition-all text-left ${
                              isSelected
                                ? "bg-doraemon-blue-light/70 text-doraemon-blue-dark"
                                : "hover:bg-doraemon-cream text-doraemon-charcoal"
                            }`}
                          >
                            <PersonaAvatarBadge avatarKey={persona.avatar} size="md" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold flex items-center justify-between">
                                <span>{persona.name}</span>
                                {isSelected && (
                                  <Check className="w-3.5 h-3.5 text-doraemon-blue" />
                                )}
                              </p>
                              <p className="text-[11px] text-doraemon-charcoal-muted truncate">
                                {persona.role}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* "Make a Wish" CTA Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsNewWishModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-doraemon-red hover:bg-doraemon-red-hover text-white font-heading font-bold text-xs sm:text-sm shadow-doraemon-red transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Make a Wish</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
