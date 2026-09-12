"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { GoldenBellIcon, PersonaAvatarBadge } from "./DoraemonIcons";
import { Mascot } from "./Mascot";
import { USER_PERSONAS } from "@/lib/seed-data";
import { ChevronDown, Plus, Bell, Check, LogOut, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Navbar() {
  const {
    currentUser,
    setCurrentUser,
    isLiveConnected,
    lastLiveEvent,
    setIsNewWishModalOpen,
    logout,
  } = useApp();

  const router = useRouter();
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const handleNotificationClick = () => {
    setShowNotificationToast(true);
    setTimeout(() => setShowNotificationToast(false), 3000);
  };

  const handleSignOut = () => {
    logout();
    setIsPersonaMenuOpen(false);
    router.push("/signup");
  };

  return (
    <header className="sticky top-0 z-40 bg-[#E8F6FF]/95 backdrop-blur-md border-b-3 border-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <motion.div whileHover={{ rotate: -8, scale: 1.06 }} transition={{ type: "spring", stiffness: 320 }}>
            <Mascot slot="head" className="w-12 h-12" />
          </motion.div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-display font-extrabold text-ink tracking-tight leading-none">
                Gadget Board
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-display font-extrabold bg-doraemon-yellow-bell text-ink border-2 border-ink shadow-ink-xs">
                <GoldenBellIcon className="w-3 h-3" />
                <span>4D Pocket</span>
              </span>
            </div>
            <p className="text-[11px] text-ink-faint font-bold truncate">
              Collaborative 22nd-Century Wish Engine
            </p>
          </div>
        </Link>

        {/* Right cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live indicator */}
          <div
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border-3 border-ink shadow-ink-xs"
            title={isLiveConnected ? "Connected to the realtime channel" : "Reconnecting…"}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-ink" />
            </span>
            <span className="text-[11px] font-display font-extrabold text-ink">
              {lastLiveEvent ? (
                <span className="text-doraemon-blue-character">{lastLiveEvent}</span>
              ) : (
                "Live"
              )}
            </span>
          </div>

          {/* Persona switcher */}
          <div className="relative">
            <button
              onClick={() => setIsPersonaMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1 sm:px-3 sm:py-1.5 rounded-full bg-white border-3 border-ink shadow-ink-xs hover:shadow-ink-sm transition-shadow text-left"
              aria-label="User profile and switcher"
              aria-expanded={isPersonaMenuOpen}
            >
              <PersonaAvatarBadge avatarKey={currentUser.avatar} size="sm" />
              <div className="hidden sm:block">
                <p className="text-xs font-display font-extrabold text-ink leading-none">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-ink-faint font-semibold leading-tight truncate max-w-[100px]">
                  {currentUser.role}
                </p>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-ink-faint transition-transform ${isPersonaMenuOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isPersonaMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsPersonaMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 320, damping: 24 }}
                    className="absolute right-0 mt-3 w-72 bg-white rounded-2xl border-3 border-ink shadow-ink-lg p-2 z-50"
                  >
                    <div className="px-3 py-2 border-b-2 border-ink/15 mb-1 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-display font-extrabold text-ink">Active Persona</p>
                        <p className="text-[10px] text-ink-faint">Switch character or sign out</p>
                      </div>
                      <Link
                        href="/signup"
                        onClick={() => setIsPersonaMenuOpen(false)}
                        className="text-[10px] font-bold text-doraemon-blue-character hover:underline"
                      >
                        Sign Up
                      </Link>
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
                            className={`w-full flex items-center gap-2.5 p-2 rounded-xl transition-colors text-left border-2 ${
                              isSelected
                                ? "bg-doraemon-blue-light border-ink"
                                : "border-transparent hover:bg-slate-50"
                            }`}
                          >
                            <PersonaAvatarBadge avatarKey={persona.avatar} size="sm" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-display font-extrabold text-ink flex items-center justify-between">
                                <span>{persona.name}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-doraemon-blue-character stroke-[3]" />}
                              </p>
                              <p className="text-[10px] text-ink-faint truncate">{persona.role}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 mt-1 border-t-2 border-ink/15">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-display font-bold text-doraemon-red-character hover:bg-doraemon-red-light rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out / Switch</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Make a Wish */}
          <motion.button
            whileHover={{ x: -2, y: -2 }}
            whileTap={{ x: 2, y: 2 }}
            onClick={() => setIsNewWishModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-doraemon-red-character text-white font-display font-extrabold text-xs sm:text-sm border-3 border-ink shadow-ink hover:shadow-ink-lg active:shadow-ink-press transition-shadow"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Make a Wish</span>
          </motion.button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={handleNotificationClick}
              className="w-10 h-10 rounded-full bg-white border-3 border-ink shadow-ink-xs hover:shadow-ink-sm flex items-center justify-center transition-shadow"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-ink" />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-doraemon-red-character border-2 border-ink" />
            </button>

            <AnimatePresence>
              {showNotificationToast && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  className="absolute right-0 mt-3 w-64 p-3 bg-white rounded-2xl border-3 border-ink shadow-ink-lg text-xs text-ink-soft z-50 font-medium"
                >
                  <div className="flex items-center gap-2 font-display font-extrabold text-doraemon-blue-character mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>4D Pocket Updates</span>
                  </div>
                  <p>Everyone connected sees new wishes and upvotes live.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
