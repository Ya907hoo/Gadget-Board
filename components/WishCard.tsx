"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Wish } from "@/lib/types";
import { useApp } from "@/lib/context";
import { GoldenBellIcon, PersonaAvatarBadge } from "./DoraemonIcons";
import { Mascot } from "./Mascot";
import { UpvoteButton } from "./UpvoteButton";
import { motion } from "framer-motion";
import { MessageSquare, MoreVertical, Pencil, Trash2 } from "lucide-react";

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
    grantWishAction,
  } = useApp();

  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isGrantingInline, setIsGrantingInline] = useState(false);
  const [gadgetName, setGadgetName] = useState("");

  const isOwner = currentUser.id === wish.creator_id;
  const isGranted = wish.status === "granted";

  const handleCardClick = () => {
    router.push(`/wish/${wish.id}`);
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

    await grantWishAction(wish.id, { granted_gadget_name: gadgetName.trim() });
    setIsGrantingInline(false);
    setGadgetName("");
  };

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
      whileHover={{ x: -3, y: -3 }}
      onClick={handleCardClick}
      className={`group relative flex flex-col rounded-2xl border-3 border-ink cursor-pointer overflow-hidden transition-shadow duration-200 shadow-ink hover:shadow-ink-xl ${
        isGranted ? "bg-doraemon-yellow-light" : "bg-white"
      }`}
    >
      {/* Granted ribbon */}
      {isGranted && (
        <div className="relative bg-doraemon-yellow-bell px-4 py-2 border-b-3 border-ink flex items-center justify-between gap-2 overflow-hidden">
          <div className="absolute inset-0 halftone-fine text-ink opacity-[0.12] pointer-events-none" />
          <span className="relative inline-flex items-center gap-1.5 text-[11px] font-display font-extrabold text-ink uppercase tracking-wide">
            <GoldenBellIcon className="w-3.5 h-3.5" />
            Wish Granted!
          </span>
          {wish.granted_gadget_name && (
            <span className="relative truncate max-w-[160px] font-display font-bold text-ink-soft text-[11px]">
              {wish.granted_gadget_name}
            </span>
          )}
        </div>
      )}

      {/* Image */}
      {wish.image_url && (
        <div className="relative h-44 w-full overflow-hidden border-b-3 border-ink bg-doraemon-cream">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={wish.image_url}
            alt={wish.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category + owner menu */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-display font-extrabold uppercase tracking-wide bg-doraemon-blue-light text-ink border-2 border-ink">
              {wish.category}
            </span>

            <div className="flex items-center gap-1.5">
              {isOwner && (
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-200 text-ink font-display font-extrabold uppercase border-2 border-ink">
                  Yours
                </span>
              )}

              {isOwner && (
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="p-1 rounded-full hover:bg-doraemon-cream text-ink-faint hover:text-ink transition-colors"
                    title="Wish options"
                    aria-label="Wish options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {isMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setIsMenuOpen(false)} />
                      <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl border-3 border-ink shadow-ink-lg p-1.5 z-40">
                        <button
                          onClick={handleEdit}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-display font-bold text-ink hover:bg-doraemon-blue-light rounded-lg transition-colors text-left"
                        >
                          <Pencil className="w-3.5 h-3.5 text-doraemon-blue-character" />
                          <span>Edit Wish</span>
                        </button>
                        <button
                          onClick={handleDelete}
                          disabled={isDeleting}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-display font-bold text-doraemon-red-character hover:bg-doraemon-red-light rounded-lg transition-colors text-left disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{isDeleting ? "Deleting…" : "Delete"}</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <h3 className="text-lg font-display font-extrabold text-ink leading-snug group-hover:text-doraemon-blue-character transition-colors line-clamp-2">
            {wish.title}
          </h3>

          <p className="mt-2 text-sm text-ink-soft line-clamp-3 leading-relaxed">
            {wish.description}
          </p>

          {/* Inline grant */}
          {isGrantingInline && (
            <div
              className="mt-3 p-3 bg-doraemon-yellow-light rounded-xl border-3 border-ink"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-[11px] font-display font-extrabold text-ink mb-1.5 flex items-center gap-1 uppercase tracking-wide">
                <GoldenBellIcon className="w-3.5 h-3.5" />
                Pick a gadget
              </p>
              <form onSubmit={handleQuickGrant} className="flex gap-1.5">
                <input
                  type="text"
                  value={gadgetName}
                  onChange={(e) => setGadgetName(e.target.value)}
                  placeholder="e.g. Anywhere Door"
                  className="flex-1 min-w-0 px-2.5 py-1 rounded-lg text-xs bg-white border-2 border-ink focus:outline-none focus:ring-2 focus:ring-doraemon-blue-character"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 rounded-lg bg-doraemon-yellow-bell text-ink font-display font-extrabold text-xs border-2 border-ink"
                >
                  Grant!
                </button>
                <button
                  type="button"
                  onClick={() => setIsGrantingInline(false)}
                  className="px-1.5 text-xs text-ink-faint hover:text-ink"
                  aria-label="Cancel"
                >
                  ✕
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t-2 border-dashed border-ink/25 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <PersonaAvatarBadge avatarKey={wish.creator_avatar} size="sm" />
            <div className="min-w-0">
              <p className="text-xs font-display font-extrabold text-ink truncate">
                {wish.creator_name}
              </p>
              <p className="text-[10px] text-ink-faint">{formatTime(wish.created_at)}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {isGranted && <Mascot slot="head" className="w-6 h-6 shrink-0" />}

            {!isGranted && !isGrantingInline && (
              <button
                onClick={() => setIsGrantingInline(true)}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-display font-extrabold text-ink bg-doraemon-yellow-light hover:bg-doraemon-yellow-bell border-2 border-ink transition-colors"
                title="Grant this wish with a gadget"
              >
                <GoldenBellIcon className="w-3 h-3" />
                <span>Grant</span>
              </button>
            )}

            <button
              onClick={handleCardClick}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold text-ink-faint hover:text-doraemon-blue-character hover:bg-doraemon-blue-light transition-colors"
              title="View discussion"
              aria-label="View discussion"
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
