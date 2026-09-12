"use client";

import React, { useState } from "react";
import { Wish } from "@/lib/types";
import { useApp } from "@/lib/context";
import { GoldenBellIcon, MagicSparkleIcon, PersonaAvatarBadge } from "./DoraemonIcons";
import { UpvoteButton } from "./UpvoteButton";
import { motion } from "framer-motion";
import {
  MessageSquare,
  MoreVertical,
  Pencil,
  Trash2,
  Sparkles,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

interface WishCardProps {
  wish: Wish;
  index: number;
}

export function WishCard({ wish, index }: WishCardProps) {
  const {
    currentUser,
    toggleUpvoteAction,
    deleteWishAction,
    setEditingWish,
    setSelectedWishForDetail,
    grantWishAction,
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGrantingInline, setIsGrantingInline] = useState(false);
  const [gadgetName, setGadgetName] = useState("");

  const isOwner = currentUser.id === wish.creator_id;
  const isGranted = wish.status === "granted";

  const handleCardClick = () => {
    setSelectedWishForDetail(wish);
  };

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleUpvoteAction(wish.id);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${wish.title}"?`)) {
      setIsDeleting(true);
      await deleteWishAction(wish.id);
      setIsDeleting(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    setEditingWish(wish);
  };

  const handleQuickGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!gadgetName.trim()) return;

    await grantWishAction(wish.id, {
      granted_gadget_name: gadgetName.trim(),
    });
    setIsGrantingInline(false);
    setGadgetName("");
  };

  // Format creation date
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) return "Just now";
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    } catch {
      return "Recently";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{ y: -4 }}
      onClick={handleCardClick}
      className={`group relative flex flex-col bg-white rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden ${
        isGranted
          ? "border-doraemon-yellow bg-gradient-to-b from-white to-doraemon-yellow-light/30 shadow-doraemon-gold"
          : "border-doraemon-cream-border hover:border-doraemon-blue/40 shadow-doraemon-card hover:shadow-doraemon-hover"
      }`}
    >
      {/* Top golden shimmer accent for granted cards */}
      {isGranted && (
        <div className="bg-gradient-to-r from-doraemon-yellow via-amber-300 to-doraemon-yellow px-4 py-1 flex items-center justify-between text-xs font-heading font-extrabold text-doraemon-charcoal">
          <div className="flex items-center gap-1.5">
            <GoldenBellIcon className="w-3.5 h-3.5" />
            <span>Wish Granted!</span>
          </div>
          {wish.granted_gadget_name && (
            <span className="truncate max-w-[180px] font-bold text-doraemon-charcoal-muted">
              ✨ {wish.granted_gadget_name}
            </span>
          )}
        </div>
      )}

      {/* Card Image (if provided) */}
      {wish.image_url && (
        <div className="relative h-44 w-full overflow-hidden bg-doraemon-cream">
          <img
            src={wish.image_url}
            alt={wish.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
      )}

      {/* Main Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Category Badge & Owner Action Menu */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-heading font-bold bg-doraemon-blue-light text-doraemon-blue-dark">
              {wish.category}
            </span>

            <div className="flex items-center gap-1">
              {isOwner && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  Your Wish
                </span>
              )}

              {/* Creator Menu (Edit / Delete) */}
              {isOwner && (
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="p-1 rounded-full hover:bg-doraemon-cream text-doraemon-charcoal-muted hover:text-doraemon-charcoal transition-colors"
                    title="Wish Options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {isMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setIsMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-1 w-32 bg-white rounded-2xl shadow-lg border border-doraemon-cream-border p-1.5 z-40">
                        <button
                          onClick={handleEdit}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-doraemon-charcoal hover:bg-doraemon-blue-light rounded-xl transition-colors text-left"
                        >
                          <Pencil className="w-3.5 h-3.5 text-doraemon-blue" />
                          <span>Edit Wish</span>
                        </button>
                        <button
                          onClick={handleDelete}
                          disabled={isDeleting}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-doraemon-red hover:bg-doraemon-red-light rounded-xl transition-colors text-left"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-heading font-bold text-doraemon-charcoal leading-snug group-hover:text-doraemon-blue transition-colors line-clamp-2">
            {wish.title}
          </h3>

          {/* Description */}
          <p className="mt-2 text-xs sm:text-sm text-doraemon-charcoal-muted line-clamp-3 leading-relaxed">
            {wish.description}
          </p>

          {/* Inline Quick-Grant Form (if triggered) */}
          {isGrantingInline && (
            <div
              className="mt-3 p-3 bg-doraemon-yellow-light rounded-2xl border border-doraemon-yellow"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-xs font-bold text-doraemon-charcoal mb-1 flex items-center gap-1">
                <GoldenBellIcon className="w-3.5 h-3.5" />
                Select 22nd-Century Gadget:
              </p>
              <form onSubmit={handleQuickGrant} className="flex gap-1.5">
                <input
                  type="text"
                  value={gadgetName}
                  onChange={(e) => setGadgetName(e.target.value)}
                  placeholder="e.g. Anywhere Door"
                  className="flex-1 px-2.5 py-1 rounded-xl text-xs bg-white border border-doraemon-yellow focus:outline-none focus:ring-1 focus:ring-amber-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 rounded-xl bg-doraemon-yellow-gold hover:bg-amber-500 text-doraemon-charcoal font-bold text-xs"
                >
                  Grant!
                </button>
                <button
                  type="button"
                  onClick={() => setIsGrantingInline(false)}
                  className="px-2 py-1 text-xs text-doraemon-charcoal-muted"
                >
                  ✕
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Card Footer: Creator Info, Comments Count, Upvote Button */}
        <div className="mt-5 pt-3 border-t border-doraemon-cream-border flex items-center justify-between gap-2">
          {/* Creator Badge */}
          <div className="flex items-center gap-2 min-w-0">
            <PersonaAvatarBadge avatarKey={wish.creator_avatar} size="sm" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-doraemon-charcoal truncate">
                {wish.creator_name}
              </p>
              <p className="text-[10px] text-doraemon-charcoal-muted">
                {formatTime(wish.created_at)}
              </p>
            </div>
          </div>

          {/* Actions: Grant Button, Comments & Upvote */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {!isGranted && !isGrantingInline && (
              <button
                onClick={() => setIsGrantingInline(true)}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-heading font-bold text-amber-800 bg-doraemon-yellow-light hover:bg-doraemon-yellow border border-doraemon-yellow transition-all"
                title="Help grant this wish with a gadget solution!"
              >
                <GoldenBellIcon className="w-3 h-3" />
                <span>Grant</span>
              </button>
            )}

            <button
              onClick={handleCardClick}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-doraemon-charcoal-muted hover:text-doraemon-blue hover:bg-doraemon-blue-light transition-colors"
              title="View Discussion & Gadget Ideas"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </button>

            <UpvoteButton
              wishId={wish.id}
              upvotesCount={wish.upvotes_count}
              hasUpvoted={wish.has_upvoted}
              onUpvote={handleUpvote}
              size="sm"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
