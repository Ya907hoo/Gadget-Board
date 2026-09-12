"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/context";
import { Wish, WishComment } from "@/lib/types";
import { PRESET_GADGETS } from "@/lib/seed-data";
import { GoldenBellIcon, MagicSparkleIcon, PersonaAvatarBadge, PocketPouchIcon } from "./DoraemonIcons";
import { UpvoteButton } from "./UpvoteButton";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MessageSquare,
  Sparkles,
  Send,
  Lightbulb,
  CheckCircle2,
  Calendar,
  Layers,
  Heart,
} from "lucide-react";

export function WishDetailModal() {
  const {
    selectedWishForDetail,
    setSelectedWishForDetail,
    currentUser,
    toggleUpvoteAction,
    grantWishAction,
  } = useApp();

  const [comments, setComments] = useState<WishComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  // New Comment Form state
  const [commentText, setCommentText] = useState("");
  const [isGadgetSolution, setIsGadgetSolution] = useState(false);
  const [gadgetName, setGadgetName] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

  // Granting Section state
  const [showGrantPanel, setShowGrantPanel] = useState(false);
  const [grantGadget, setGrantGadget] = useState("");
  const [grantNote, setGrantNote] = useState("");
  const [isGranting, setIsGranting] = useState(false);

  // Load comments whenever selectedWishForDetail changes
  useEffect(() => {
    if (selectedWishForDetail) {
      setIsLoadingComments(true);
      fetch(`/api/comments?wishId=${selectedWishForDetail.id}`)
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            setComments(json.data || []);
          }
        })
        .catch((err) => console.error("Failed to load comments:", err))
        .finally(() => setIsLoadingComments(false));
    } else {
      setComments([]);
      setCommentText("");
      setIsGadgetSolution(false);
      setGadgetName("");
      setShowGrantPanel(false);
    }
  }, [selectedWishForDetail]);

  if (!selectedWishForDetail) return null;

  const wish = selectedWishForDetail;
  const isGranted = wish.status === "granted";

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await toggleUpvoteAction(wish.id);
    if (result.success && selectedWishForDetail) {
      setSelectedWishForDetail({
        ...selectedWishForDetail,
        upvotes_count: result.upvotes_count,
        has_upvoted: result.has_upvoted,
      });
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    setCommentError(null);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wishId: wish.id,
          content: commentText.trim(),
          is_gadget_solution: isGadgetSolution,
          gadget_name: isGadgetSolution ? gadgetName.trim() || "Secret Gadget" : null,
          user_id: currentUser.id,
          user_name: currentUser.name,
          user_avatar: currentUser.avatar,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setCommentError(data.error || "Failed to post comment");
        return;
      }

      setComments((prev) => [...prev, data.data]);
      setCommentText("");
      setIsGadgetSolution(false);
      setGadgetName("");
    } catch (err: any) {
      setCommentError(err.message || "Network error");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleGrantWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantGadget.trim()) return;

    setIsGranting(true);
    const result = await grantWishAction(wish.id, {
      granted_gadget_name: grantGadget.trim(),
      comment: grantNote.trim() || undefined,
    });
    setIsGranting(false);

    if (result.success) {
      setSelectedWishForDetail({
        ...wish,
        status: "granted",
        granted_gadget_name: grantGadget.trim(),
        granted_at: new Date().toISOString(),
      });
      setShowGrantPanel(false);
      // reload comments
      const commRes = await fetch(`/api/comments?wishId=${wish.id}`);
      const commJson = await commRes.json();
      if (commJson.success) setComments(commJson.data || []);
    }
  };

  const formatCommentDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedWishForDetail(null)}
          className="fixed inset-0 bg-doraemon-charcoal/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-4xl border border-doraemon-cream-border shadow-2xl overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]"
        >
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-doraemon-blue via-sky-500 to-doraemon-blue px-6 py-4 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <PocketPouchIcon className="w-6 h-6 text-white" />
              <span className="font-heading font-extrabold text-sm sm:text-base">
                Wish & Gadget Solution Hub
              </span>
            </div>
            <button
              onClick={() => setSelectedWishForDetail(null)}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Modal Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Granted Banner if already granted */}
            {isGranted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-3xl bg-doraemon-yellow-light border-2 border-doraemon-yellow flex items-center justify-between gap-3 shadow-doraemon-gold"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-doraemon-yellow flex items-center justify-center shadow-sm">
                    <GoldenBellIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-sm text-doraemon-charcoal flex items-center gap-1.5">
                      <span>Wish Granted by 4D Pocket!</span>
                      <Sparkles className="w-4 h-4 text-amber-600" />
                    </h4>
                    <p className="text-xs text-doraemon-charcoal-muted">
                      Solved with:{" "}
                      <span className="font-bold text-doraemon-charcoal">
                        {wish.granted_gadget_name || "Secret Gadget"}
                      </span>
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 bg-white rounded-full text-amber-900 border border-doraemon-yellow">
                  ✨ Resolved
                </span>
              </motion.div>
            )}

            {/* Main Wish Details */}
            <div className="bg-doraemon-cream rounded-3xl p-5 border border-doraemon-cream-border">
              {wish.image_url && (
                <div className="h-56 w-full rounded-2xl overflow-hidden mb-4 bg-white shadow-sm">
                  <img
                    src={wish.image_url}
                    alt={wish.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-heading font-bold bg-doraemon-blue-light text-doraemon-blue-dark">
                  {wish.category}
                </span>

                <div className="flex items-center gap-2">
                  <UpvoteButton
                    wishId={wish.id}
                    upvotesCount={wish.upvotes_count}
                    hasUpvoted={wish.has_upvoted}
                    onUpvote={handleUpvote}
                  />
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-heading font-black text-doraemon-charcoal leading-snug">
                {wish.title}
              </h2>

              <p className="mt-3 text-sm text-doraemon-charcoal-muted leading-relaxed whitespace-pre-line">
                {wish.description}
              </p>

              <div className="mt-4 pt-3 border-t border-doraemon-cream-border/60 flex items-center justify-between text-xs text-doraemon-charcoal-muted">
                <div className="flex items-center gap-2">
                  <PersonaAvatarBadge avatarKey={wish.creator_avatar} size="sm" />
                  <span className="font-bold text-doraemon-charcoal">
                    {wish.creator_name}
                  </span>
                </div>
                <span>Posted {new Date(wish.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Grant Action Section (if not granted yet) */}
            {!isGranted && (
              <div className="p-4 rounded-3xl bg-doraemon-yellow-light/60 border border-doraemon-yellow/60">
                {!showGrantPanel ? (
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-doraemon-charcoal flex items-center gap-1.5">
                        <GoldenBellIcon className="w-4 h-4" />
                        <span>Know a Doraemon Gadget that can solve this?</span>
                      </h4>
                      <p className="text-[11px] text-doraemon-charcoal-muted">
                        Grant this wish to celebrate and mark it resolved!
                      </p>
                    </div>
                    <button
                      onClick={() => setShowGrantPanel(true)}
                      className="px-4 py-2 rounded-full bg-doraemon-yellow hover:bg-doraemon-yellow-dark text-doraemon-charcoal font-heading font-bold text-xs shadow-doraemon-gold transition-all shrink-0"
                    >
                      Help Grant Wish ✨
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleGrantWish} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-bold text-xs text-doraemon-charcoal flex items-center gap-1.5">
                        <GoldenBellIcon className="w-4 h-4" />
                        <span>Select or Name the 22nd-Century Gadget Solution:</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowGrantPanel(false)}
                        className="text-xs text-doraemon-charcoal-muted hover:text-doraemon-charcoal"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {PRESET_GADGETS.slice(0, 6).map((g) => (
                        <button
                          type="button"
                          key={g}
                          onClick={() => setGrantGadget(g)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
                            grantGadget === g
                              ? "bg-doraemon-blue text-white border-doraemon-blue"
                              : "bg-white text-doraemon-charcoal border-doraemon-yellow hover:bg-yellow-100"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      value={grantGadget}
                      onChange={(e) => setGrantGadget(e.target.value)}
                      placeholder="Gadget Name (e.g., Anywhere Door, Time Cloth...)"
                      required
                      className="w-full px-3 py-2 rounded-2xl bg-white border border-doraemon-yellow text-xs focus:outline-none focus:ring-2 focus:ring-doraemon-yellow"
                    />

                    <input
                      type="text"
                      value={grantNote}
                      onChange={(e) => setGrantNote(e.target.value)}
                      placeholder="Celebratory comment explaining how it solves the wish..."
                      className="w-full px-3 py-2 rounded-2xl bg-white border border-doraemon-yellow text-xs focus:outline-none focus:ring-2 focus:ring-doraemon-yellow"
                    />

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isGranting || !grantGadget.trim()}
                        className="px-5 py-2 rounded-full bg-doraemon-yellow-gold hover:bg-amber-500 font-heading font-bold text-xs text-doraemon-charcoal shadow-sm transition-all disabled:opacity-50"
                      >
                        {isGranting ? "Granting..." : "🎉 Celebrate & Grant Wish!"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Comments & Gadget Ideas Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-doraemon-blue" />
                <h3 className="font-heading font-bold text-sm text-doraemon-charcoal">
                  Gadget Brainstorming & Discussion ({comments.length})
                </h3>
              </div>

              {/* Comments List */}
              <div className="space-y-3 mb-4">
                {isLoadingComments ? (
                  <div className="p-4 text-center text-xs text-doraemon-charcoal-muted animate-pulse">
                    Summoning gadget suggestions from the pocket...
                  </div>
                ) : comments.length === 0 ? (
                  <div className="p-5 text-center text-xs text-doraemon-charcoal-muted bg-doraemon-cream rounded-2xl border border-doraemon-cream-border">
                    No comments or gadget solutions yet. Be the first to suggest one below!
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-3.5 rounded-2xl border text-xs transition-all ${
                        comment.is_gadget_solution
                          ? "bg-doraemon-yellow-light/40 border-doraemon-yellow"
                          : "bg-white border-doraemon-cream-border"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <PersonaAvatarBadge avatarKey={comment.user_avatar} size="sm" />
                          <span className="font-bold text-doraemon-charcoal">
                            {comment.user_name}
                          </span>
                          {comment.is_gadget_solution && (
                            <span className="px-2 py-0.5 rounded-full bg-doraemon-yellow text-doraemon-charcoal font-bold text-[10px] flex items-center gap-1">
                              <Lightbulb className="w-2.5 h-2.5" />
                              Gadget Idea: {comment.gadget_name}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-doraemon-charcoal-muted">
                          {formatCommentDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-doraemon-charcoal leading-relaxed pl-8">
                        {comment.content}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handlePostComment} className="space-y-2">
                {commentError && (
                  <p className="text-xs text-doraemon-red font-semibold">{commentError}</p>
                )}

                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="checkbox"
                    id="isGadgetSolution"
                    checked={isGadgetSolution}
                    onChange={(e) => setIsGadgetSolution(e.target.checked)}
                    className="rounded text-doraemon-blue focus:ring-doraemon-blue"
                  />
                  <label
                    htmlFor="isGadgetSolution"
                    className="text-xs font-bold text-doraemon-charcoal cursor-pointer flex items-center gap-1"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>This is a 22nd-Century Gadget Suggestion</span>
                  </label>
                </div>

                {isGadgetSolution && (
                  <input
                    type="text"
                    value={gadgetName}
                    onChange={(e) => setGadgetName(e.target.value)}
                    placeholder="Gadget Name (e.g. Memory Bread, Time Machine...)"
                    className="w-full px-3 py-2 rounded-2xl bg-doraemon-cream border border-doraemon-yellow text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={`Comment as ${currentUser.name}...`}
                    className="flex-1 px-4 py-2.5 rounded-full bg-doraemon-cream border border-doraemon-cream-border text-xs focus:outline-none focus:border-doraemon-blue"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !commentText.trim()}
                    className="px-4 py-2.5 rounded-full bg-doraemon-blue hover:bg-doraemon-blue-hover text-white font-heading font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
