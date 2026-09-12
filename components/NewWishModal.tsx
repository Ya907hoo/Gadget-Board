"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { CATEGORIES, createWishSchema } from "@/lib/validation";
import { GADGET_IMAGE_PRESETS } from "@/lib/seed-data";
import { WishCategory } from "@/lib/types";
import { GoldenBellIcon, PersonaAvatarBadge, PocketPouchIcon } from "./DoraemonIcons";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, AlertCircle, Image as ImageIcon, Check } from "lucide-react";

export function NewWishModal() {
  const { isNewWishModalOpen, setIsNewWishModalOpen, createWishAction, currentUser } = useApp();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<WishCategory>("Daily Life");
  const [imageUrl, setImageUrl] = useState("");
  const [showPresets, setShowPresets] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  if (!isNewWishModalOpen) return null;

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation with Zod
    const validationResult = createWishSchema.safeParse({
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
    const result = await createWishAction({
      title,
      description,
      category,
      image_url: imageUrl.trim() || null,
    });
    setIsSubmitting(false);

    if (!result.success) {
      setErrors({ form: result.error || "Failed to create wish" });
      triggerShake();
      return;
    }

    // Reset and close
    setTitle("");
    setDescription("");
    setImageUrl("");
    setCategory("Daily Life");
    setErrors({});
    setIsNewWishModalOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsNewWishModalOpen(false)}
          className="fixed inset-0 bg-doraemon-charcoal/40 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={
            shake
              ? { x: [-10, 10, -8, 8, -4, 4, 0], opacity: 1, scale: 1, y: 0 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full max-w-xl bg-white rounded-4xl border border-doraemon-cream-border shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-doraemon-blue to-doraemon-blue-dark px-6 py-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <PocketPouchIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-heading font-black text-lg sm:text-xl">
                  Post a Wish into the 4D Pocket
                </h3>
                <p className="text-xs text-white/80 font-medium">
                  Posting as{" "}
                  <span className="font-bold underline">{currentUser.name}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsNewWishModalOpen(false)}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Global Form Error */}
            {errors.form && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-2xl bg-doraemon-red-light border border-doraemon-red text-doraemon-red text-xs font-bold flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.form}</span>
              </motion.div>
            )}

            {/* Wish Title */}
            <div>
              <label className="block text-xs font-heading font-bold text-doraemon-charcoal uppercase tracking-wider mb-1.5">
                Wish Title <span className="text-doraemon-red">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Skip the morning subway crowd..."
                className={`w-full px-4 py-3 rounded-2xl bg-doraemon-cream border text-sm text-doraemon-charcoal placeholder:text-doraemon-charcoal-muted focus:outline-none focus:ring-2 transition-all ${
                  errors.title
                    ? "border-doraemon-red focus:ring-red-200"
                    : "border-doraemon-cream-border focus:border-doraemon-blue focus:ring-doraemon-blue-light"
                }`}
              />
              {errors.title && (
                <p className="text-xs text-doraemon-red mt-1 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.title}
                </p>
              )}
            </div>

            {/* Category Pill Selection */}
            <div>
              <label className="block text-xs font-heading font-bold text-doraemon-charcoal uppercase tracking-wider mb-2">
                Category Tag <span className="text-doraemon-red">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-heading font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-doraemon-blue text-white shadow-doraemon-card"
                          : "bg-doraemon-cream text-doraemon-charcoal hover:bg-white border border-doraemon-cream-border"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-heading font-bold text-doraemon-charcoal uppercase tracking-wider mb-1.5">
                Wish Description <span className="text-doraemon-red">*</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your wish or dilemma in detail so friends and Doraemon can brainstorm the perfect gadget..."
                className={`w-full px-4 py-3 rounded-2xl bg-doraemon-cream border text-sm text-doraemon-charcoal placeholder:text-doraemon-charcoal-muted focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.description
                    ? "border-doraemon-red focus:ring-red-200"
                    : "border-doraemon-cream-border focus:border-doraemon-blue focus:ring-doraemon-blue-light"
                }`}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.description ? (
                  <p className="text-xs text-doraemon-red font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.description}
                  </p>
                ) : (
                  <span className="text-[11px] text-doraemon-charcoal-muted">
                    Min 10 characters
                  </span>
                )}
                <span className="text-[11px] text-doraemon-charcoal-muted">
                  {description.length}/1200
                </span>
              </div>
            </div>

            {/* Optional Image URL / Presets */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-heading font-bold text-doraemon-charcoal uppercase tracking-wider">
                  Illustration Image (Optional)
                </label>
                <button
                  type="button"
                  onClick={() => setShowPresets((prev) => !prev)}
                  className="text-xs font-bold text-doraemon-blue hover:underline flex items-center gap-1"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>{showPresets ? "Hide Presets" : "Pick a Preset Photo"}</span>
                </button>
              </div>

              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className={`w-full px-4 py-2.5 rounded-2xl bg-doraemon-cream border text-sm text-doraemon-charcoal placeholder:text-doraemon-charcoal-muted focus:outline-none focus:ring-2 transition-all ${
                  errors.image_url
                    ? "border-doraemon-red focus:ring-red-200"
                    : "border-doraemon-cream-border focus:border-doraemon-blue focus:ring-doraemon-blue-light"
                }`}
              />
              {errors.image_url && (
                <p className="text-xs text-doraemon-red mt-1 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.image_url}
                </p>
              )}

              {/* Preset Image Thumbnails */}
              {showPresets && (
                <div className="mt-3 p-3 bg-doraemon-cream rounded-2xl border border-doraemon-cream-border">
                  <p className="text-xs font-bold text-doraemon-charcoal mb-2">
                    Click an anime-inspired photo to use:
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {GADGET_IMAGE_PRESETS.map((p) => {
                      const isSelected = imageUrl === p.url;
                      return (
                        <div
                          key={p.name}
                          onClick={() => setImageUrl(p.url)}
                          className={`group relative h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                            isSelected
                              ? "border-doraemon-blue ring-2 ring-doraemon-blue-light"
                              : "border-transparent hover:opacity-90"
                          }`}
                        >
                          <img
                            src={p.url}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-doraemon-blue/40 flex items-center justify-center text-white">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-doraemon-cream-border">
              <button
                type="button"
                onClick={() => setIsNewWishModalOpen(false)}
                className="px-5 py-2.5 rounded-full text-xs font-heading font-bold text-doraemon-charcoal-muted hover:bg-doraemon-cream transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-doraemon-red hover:bg-doraemon-red-hover text-white font-heading font-bold text-xs sm:text-sm shadow-doraemon-red transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Opening 4D Pocket...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Post Wish Idea</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
