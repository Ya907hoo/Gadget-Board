"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface UpvoteButtonProps {
  wishId: string;
  upvotesCount: number;
  hasUpvoted?: boolean;
  onUpvote: (e: React.MouseEvent) => void;
  size?: "sm" | "md";
}

interface Particle {
  id: number;
  x: number;
}

export function UpvoteButton({
  wishId,
  upvotesCount,
  hasUpvoted = false,
  onUpvote,
  size = "md",
}: UpvoteButtonProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Trigger floating +1 particle effect if voting up
    if (!hasUpvoted) {
      const newParticle: Particle = {
        id: Date.now(),
        x: (Math.random() - 0.5) * 20,
      };
      setParticles((prev) => [...prev, newParticle]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, 900);
    }

    onUpvote(e);
  };

  const isSmall = size === "sm";

  return (
    <div className="relative inline-block">
      {/* Floating "+1" Micro-Particles */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 1, y: 0, scale: 0.8, x: p.x }}
            animate={{ opacity: 0, y: -34, scale: 1.2, x: p.x * 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="absolute left-1/2 -top-2 pointer-events-none font-heading font-black text-sm text-doraemon-red select-none z-20"
          >
            +1 ✨
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Interactive Micro-Animated Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.88 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        onClick={handleClick}
        className={`flex items-center gap-1.5 rounded-full font-heading font-extrabold transition-all duration-200 cursor-pointer select-none ${
          isSmall ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-xs sm:text-sm"
        } ${
          hasUpvoted
            ? "bg-doraemon-red text-white shadow-doraemon-red"
            : "bg-white text-doraemon-charcoal hover:text-doraemon-red hover:bg-doraemon-red-light/60 border border-doraemon-cream-border"
        }`}
        title={hasUpvoted ? "Remove your upvote" : "Upvote this wish!"}
      >
        <motion.div
          animate={hasUpvoted ? { scale: [1, 1.35, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={`${isSmall ? "w-3.5 h-3.5" : "w-4 h-4"} ${
              hasUpvoted ? "fill-white stroke-white" : "stroke-current fill-transparent"
            }`}
          />
        </motion.div>
        <span>{upvotesCount}</span>
      </motion.button>
    </div>
  );
}
