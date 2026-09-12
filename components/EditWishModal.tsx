"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/context";
import { CATEGORIES, updateWishSchema } from "@/lib/validation";
import { WishCategory } from "@/lib/types";
import { PocketPouchIcon } from "./DoraemonIcons";
import { motion, AnimatePresence } from "framer-motion";
import { X, Pencil, AlertCircle, Save } from "lucide-react";

export function EditWishModal() {
  const { editingWish, setEditingWish, updateWishAction, currentUser } = useApp();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<WishCategory>("Daily Life");
  const [imageUrl, setImageUrl] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (editingWish) {
      setTitle(editingWish.title);
      setDescription(editingWish.description);
      setCategory(editingWish.category);
      setImageUrl(editingWish.image_url || "");
      setErrors({});
    }
  }, [editingWish]);

  if (!editingWish) return null;

  const isOwner = currentUser.id === editingWish.creator_id;

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!isOwner) {
      setErrors({ form: "Unauthorized: Only the creator of this wish can edit it." });
      triggerShake();
      return;
    }

    const validationResult = updateWishSchema.safeParse({
      title,
      description,
      category,
      image_url: imageUrl || undefined,
    });

    if (!validationResult.success) {
      const fieldErrors: { [key: string]: string } = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      triggerShake();
      return;
    }

    setIsSubmitting(true);
    const result = await updateWishAction(editingWish.id, {
      title,
      description,
      category,
      image_url: imageUrl.trim() || null,
    });
    setIsSubmitting(false);

    if (!result.success) {
      setErrors({ form: result.error || "Failed to update wish" });
      triggerShake();
      return;
    }

    setEditingWish(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setEditingWish(null)}
          className="fixed inset-0 bg-doraemon-charcoal/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={
            shake
              ? { x: [-10, 10, -8, 8, -4, 4, 0], opacity: 1, scale: 1, y: 0 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-4xl border border-doraemon-cream-border shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="bg-doraemon-blue px-6 py-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <Pencil className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-black text-lg sm:text-xl">
                  Edit Your Wish
                </h3>
                <p className="text-xs text-white/80 font-medium">
                  Modifying wish as{" "}
                  <span className="font-bold underline">{currentUser.name}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setEditingWish(null)}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {errors.form && (
              <div className="p-3 rounded-2xl bg-doraemon-red-light border border-doraemon-red text-doraemon-red text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            {!isOwner && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-800 text-xs font-semibold">
                You are currently viewing this wish as {currentUser.name}. Only {editingWish.creator_name} can save edits to this wish. Switch personas from the top-right menu to edit.
              </div>
            )}

            <div>
              <label className="block text-xs font-heading font-bold text-doraemon-charcoal uppercase tracking-wider mb-1.5">
                Wish Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={!isOwner}
                className={`w-full px-4 py-3 rounded-2xl bg-doraemon-cream border text-sm text-doraemon-charcoal focus:outline-none focus:ring-2 transition-all ${
                  errors.title
                    ? "border-doraemon-red focus:ring-red-200"
                    : "border-doraemon-cream-border focus:border-doraemon-blue"
                }`}
              />
              {errors.title && (
                <p className="text-xs text-doraemon-red mt-1 font-semibold">
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-doraemon-charcoal uppercase tracking-wider mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <button
                      type="button"
                      key={cat}
                      disabled={!isOwner}
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-heading font-bold transition-all ${
                        isSelected
                          ? "bg-doraemon-blue text-white shadow-sm"
                          : "bg-doraemon-cream text-doraemon-charcoal hover:bg-white border border-doraemon-cream-border"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-doraemon-charcoal uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!isOwner}
                className={`w-full px-4 py-3 rounded-2xl bg-doraemon-cream border text-sm text-doraemon-charcoal focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.description
                    ? "border-doraemon-red focus:ring-red-200"
                    : "border-doraemon-cream-border focus:border-doraemon-blue"
                }`}
              />
              {errors.description && (
                <p className="text-xs text-doraemon-red mt-1 font-semibold">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-doraemon-charcoal uppercase tracking-wider mb-1.5">
                Image URL (Optional)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={!isOwner}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-2xl bg-doraemon-cream border border-doraemon-cream-border text-sm text-doraemon-charcoal focus:outline-none focus:border-doraemon-blue"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-doraemon-cream-border">
              <button
                type="button"
                onClick={() => setEditingWish(null)}
                className="px-5 py-2.5 rounded-full text-xs font-heading font-bold text-doraemon-charcoal-muted hover:bg-doraemon-cream transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isOwner}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-doraemon-blue hover:bg-doraemon-blue-hover text-white font-heading font-bold text-xs sm:text-sm shadow-doraemon-sm transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
