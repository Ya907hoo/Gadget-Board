"use client";

import React, { useEffect } from "react";
import { useApp } from "@/lib/context";
import { GoldenBellIcon, MagicSparkleIcon, PocketPouchIcon } from "./DoraemonIcons";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, Check, Heart } from "lucide-react";

export function GrantedCelebration() {
  const { celebratingWish, setCelebratingWish } = useApp();

  useEffect(() => {
    if (celebratingWish) {
      // Fire vibrant celebratory Doraemon confetti explosion
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;

      const colors = ["#0A84FF", "#FFD447", "#FF4D4D", "#FFFFFF", "#7EC8E3"];

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors,
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors,
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [celebratingWish]);

  if (!celebratingWish) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCelebratingWish(null)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 30 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="relative max-w-md w-full bg-white rounded-4xl border-2 border-doraemon-yellow p-6 sm:p-8 text-center shadow-2xl z-10 overflow-hidden golden-sweep"
        >
          {/* Big Golden Bell Icon with Sparkles */}
          <div className="relative w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <motion.div
              animate={{ rotate: [-10, 10, -10], scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-16 h-16 rounded-full bg-doraemon-yellow-light border-2 border-doraemon-yellow flex items-center justify-center shadow-doraemon-gold"
            >
              <GoldenBellIcon className="w-10 h-10" />
            </motion.div>
            <div className="absolute -top-1 -right-1">
              <MagicSparkleIcon className="w-6 h-6 text-doraemon-yellow-gold" />
            </div>
          </div>

          <h3 className="text-2xl font-heading font-black text-doraemon-charcoal">
            Wish Officially Granted!
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-doraemon-charcoal-muted leading-relaxed">
            "{celebratingWish.title}" has been successfully resolved using the magical 22nd-century gadget:
          </p>

          <div className="my-4 p-3 rounded-2xl bg-doraemon-yellow-light border border-doraemon-yellow text-doraemon-charcoal font-heading font-extrabold text-sm sm:text-base flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>{celebratingWish.granted_gadget_name || "Secret 4D Gadget"}</span>
          </div>

          <p className="text-xs text-doraemon-charcoal-muted mb-5">
            Thank you for bringing dreams to life on the Gadget Board! 🎈
          </p>

          <button
            onClick={() => setCelebratingWish(null)}
            className="w-full py-3 rounded-full bg-doraemon-blue hover:bg-doraemon-blue-hover text-white font-heading font-bold text-sm shadow-doraemon-card transition-all cursor-pointer"
          >
            Awesome! View Board
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
