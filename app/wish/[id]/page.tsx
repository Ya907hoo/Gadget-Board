"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Wish, WishComment } from "@/lib/types";
import { useApp } from "@/lib/context";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GoldenBellIcon, MagicSparkleIcon, PersonaAvatarBadge, PocketPouchIcon } from "@/components/DoraemonIcons";
import { UpvoteButton } from "@/components/UpvoteButton";
import { PRESET_GADGETS } from "@/lib/seed-data";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, Sparkles, Send, Lightbulb, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function WishDetailPage() {
  const params = useParams();
  const router = useRouter();
  const wishId = params.id as string;

  const { currentUser, toggleUpvoteAction, grantWishAction } = useApp();

  const [wish, setWish] = useState<Wish | null>(null);
  const [comments, setComments] = useState<WishComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Comment input
  const [commentText, setCommentText] = useState("");
  const [isGadgetSolution, setIsGadgetSolution] = useState(false);
  const [gadgetName, setGadgetName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Grant input
  const [grantGadget, setGrantGadget] = useState("");
  const [isGranting, setIsGranting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [wishRes, commRes] = await Promise.all([
        fetch(`/api/wishes/${wishId}?userId=${currentUser.id}`),
        fetch(`/api/comments?wishId=${wishId}`),
      ]);

      const wishJson = await wishRes.json();
      const commJson = await commRes.json();

      if (wishJson.success) setWish(wishJson.data);
      if (commJson.success) setComments(commJson.data || []);
    } catch (e) {
      console.error("Error loading wish detail:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (wishId) {
      loadData();
    }
  }, [wishId, currentUser.id]);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!wish) return;
    const res = await toggleUpvoteAction(wish.id);
    if (res.success) {
      setWish((prev) =>
        prev
          ? {
              ...prev,
              upvotes_count: res.upvotes_count,
              has_upvoted: res.has_upvoted,
            }
          : null
      );
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !wish) return;

    setIsSubmitting(true);
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
      if (data.success) {
        setComments((prev) => [...prev, data.data]);
        setCommentText("");
        setIsGadgetSolution(false);
        setGadgetName("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantGadget.trim() || !wish) return;

    setIsGranting(true);
    const res = await grantWishAction(wish.id, {
      granted_gadget_name: grantGadget.trim(),
    });
    setIsGranting(false);

    if (res.success) {
      loadData();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-doraemon-cream flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="w-12 h-12 border-4 border-doraemon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-heading font-bold text-doraemon-charcoal">Summoning wish from the 4D pocket...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!wish) {
    return (
      <div className="min-h-screen bg-doraemon-cream flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-heading font-black text-doraemon-charcoal mb-3">Wish Not Found</h2>
          <p className="text-sm text-doraemon-charcoal-muted mb-6">This wish may have traveled to another timeline.</p>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-full bg-doraemon-blue text-white font-heading font-bold text-sm"
          >
            Back to Idea Board
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isGranted = wish.status === "granted";

  return (
    <div className="min-h-screen bg-doraemon-cream flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-heading font-bold text-doraemon-charcoal-muted hover:text-doraemon-blue transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Wishes</span>
        </Link>

        {/* Granted Highlight Banner */}
        {isGranted && (
          <div className="mb-6 p-4 rounded-3xl bg-doraemon-yellow-light border-2 border-doraemon-yellow flex items-center justify-between gap-3 shadow-doraemon-gold">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-doraemon-yellow flex items-center justify-center">
                <GoldenBellIcon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-heading font-black text-base text-doraemon-charcoal flex items-center gap-1.5">
                  <span>Wish Officially Granted!</span>
                  <Sparkles className="w-4 h-4 text-amber-600" />
                </h3>
                <p className="text-xs text-doraemon-charcoal-muted">
                  Solved using the gadget: <span className="font-bold text-doraemon-charcoal">{wish.granted_gadget_name}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Wish Main Card */}
        <div className="bg-white rounded-4xl border border-doraemon-cream-border p-6 sm:p-8 shadow-doraemon-card mb-8">
          {wish.image_url && (
            <div className="h-72 w-full rounded-3xl overflow-hidden mb-6 bg-doraemon-cream">
              <img src={wish.image_url} alt={wish.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-heading font-bold bg-doraemon-blue-light text-doraemon-blue-dark">
              {wish.category}
            </span>

            <UpvoteButton
              wishId={wish.id}
              upvotesCount={wish.upvotes_count}
              hasUpvoted={wish.has_upvoted}
              onUpvote={handleUpvote}
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-black text-doraemon-charcoal leading-tight">
            {wish.title}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-doraemon-charcoal-muted leading-relaxed whitespace-pre-line">
            {wish.description}
          </p>

          <div className="mt-6 pt-4 border-t border-doraemon-cream-border flex items-center justify-between text-xs text-doraemon-charcoal-muted">
            <div className="flex items-center gap-2">
              <PersonaAvatarBadge avatarKey={wish.creator_avatar} size="sm" />
              <span className="font-bold text-doraemon-charcoal">{wish.creator_name}</span>
            </div>
            <span>Posted {new Date(wish.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Grant Section if not granted */}
        {!isGranted && (
          <div className="bg-doraemon-yellow-light rounded-3xl border border-doraemon-yellow p-6 mb-8">
            <h3 className="font-heading font-black text-base text-doraemon-charcoal flex items-center gap-2 mb-2">
              <GoldenBellIcon className="w-5 h-5" />
              <span>Have a Gadget to Grant this Wish?</span>
            </h3>
            <p className="text-xs text-doraemon-charcoal-muted mb-4">
              Suggest a 22nd-century invention that makes this wish a reality.
            </p>

            <form onSubmit={handleGrant} className="space-y-3">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {PRESET_GADGETS.slice(0, 5).map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setGrantGadget(g)}
                    className="px-2.5 py-1 rounded-full text-xs font-bold bg-white border border-doraemon-yellow hover:bg-yellow-100"
                  >
                    {g}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={grantGadget}
                  onChange={(e) => setGrantGadget(e.target.value)}
                  placeholder="Gadget Name (e.g. Anywhere Door)"
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-white border border-doraemon-yellow text-xs focus:outline-none focus:ring-2 focus:ring-doraemon-yellow"
                />
                <button
                  type="submit"
                  disabled={isGranting || !grantGadget.trim()}
                  className="px-6 py-2.5 rounded-full bg-doraemon-yellow-gold hover:bg-amber-500 font-heading font-bold text-xs text-doraemon-charcoal shadow-sm transition-all disabled:opacity-50"
                >
                  {isGranting ? "Granting..." : "Grant Wish! ✨"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Discussion Section */}
        <div className="bg-white rounded-4xl border border-doraemon-cream-border p-6 sm:p-8 shadow-doraemon-card">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-doraemon-blue" />
            <h3 className="font-heading font-black text-lg text-doraemon-charcoal">
              Brainstorming & Comments ({comments.length})
            </h3>
          </div>

          <div className="space-y-3 mb-6">
            {comments.length === 0 ? (
              <p className="text-xs text-doraemon-charcoal-muted text-center py-6">
                No comments or gadgets yet. Be the first to share your thoughts!
              </p>
            ) : (
              comments.map((c) => (
                <div
                  key={c.id}
                  className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                    c.is_gadget_solution
                      ? "bg-doraemon-yellow-light/40 border-doraemon-yellow"
                      : "bg-doraemon-cream border-doraemon-cream-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <PersonaAvatarBadge avatarKey={c.user_avatar} size="sm" />
                      <span className="font-bold text-doraemon-charcoal">{c.user_name}</span>
                      {c.is_gadget_solution && (
                        <span className="px-2 py-0.5 rounded-full bg-doraemon-yellow text-doraemon-charcoal font-bold text-[10px] flex items-center gap-1">
                          <Lightbulb className="w-3 h-3" />
                          {c.gadget_name}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-doraemon-charcoal-muted">
                      {new Date(c.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-doraemon-charcoal pl-8">{c.content}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handlePostComment} className="space-y-3 pt-4 border-t border-doraemon-cream-border">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pageIsGadget"
                checked={isGadgetSolution}
                onChange={(e) => setIsGadgetSolution(e.target.checked)}
                className="rounded text-doraemon-blue"
              />
              <label htmlFor="pageIsGadget" className="text-xs font-bold text-doraemon-charcoal cursor-pointer flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Suggest a 22nd-Century Gadget Solution</span>
              </label>
            </div>

            {isGadgetSolution && (
              <input
                type="text"
                value={gadgetName}
                onChange={(e) => setGadgetName(e.target.value)}
                placeholder="Gadget Name (e.g., Small Light, Memory Bread)"
                className="w-full px-4 py-2.5 rounded-2xl bg-doraemon-cream border border-doraemon-yellow text-xs focus:outline-none"
              />
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={`Comment as ${currentUser.name}...`}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-doraemon-cream border border-doraemon-cream-border text-xs focus:outline-none focus:border-doraemon-blue"
              />
              <button
                type="submit"
                disabled={isSubmitting || !commentText.trim()}
                className="px-5 py-2.5 rounded-full bg-doraemon-blue hover:bg-doraemon-blue-hover text-white font-heading font-bold text-xs flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
