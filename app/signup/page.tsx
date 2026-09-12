"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/context";
import { USER_PERSONAS } from "@/lib/seed-data";
import { UserPersona } from "@/lib/types";
import { DoraemonHeadIcon, FlyingDoraemon } from "@/components/DoraemonMascot";
import { GoldenBellIcon, MagicSparkleIcon, PersonaAvatarBadge, PocketPouchIcon } from "@/components/DoraemonIcons";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, UserCheck, ShieldCheck, Mail, Lock, User, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const { login, signup } = useApp();

  const [mode, setMode] = useState<"persona" | "custom">("persona");
  const [isSignIn, setIsSignIn] = useState(false);

  // Selected persona
  const [selectedPersona, setSelectedPersona] = useState<UserPersona>(USER_PERSONAS[0]);

  // Custom form state
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [customPassword, setCustomPassword] = useState("");
  const [customAvatar, setCustomAvatar] = useState("nobita");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePersonaSubmit = () => {
    login(selectedPersona);
    router.push("/");
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!customName.trim()) {
      setFormError("Please enter your name");
      return;
    }
    if (!customEmail.trim() || !customEmail.includes("@")) {
      setFormError("Please enter a valid email address");
      return;
    }
    if (customPassword.length < 4) {
      setFormError("Password must be at least 4 characters");
      return;
    }

    setIsSubmitting(true);

    const newUser: UserPersona = {
      id: `user-${Date.now()}`,
      name: customName.trim(),
      avatar: customAvatar,
      role: "22nd-Century Dreamer",
      bio: "Joined the Gadget Board collaborative pocket!",
      themeColor: "#0A84FF",
    };

    signup(newUser);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/");
    }, 400);
  };

  const handleGuestEntry = () => {
    login(USER_PERSONAS[0]);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#DDF2FE] via-[#EEF7FF] to-[#FFFDF7] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Floating decorative background elements */}
      <div className="absolute top-8 left-8 w-40 h-20 bg-white/60 rounded-full blur-md pointer-events-none"></div>
      <div className="absolute bottom-12 right-12 w-64 h-32 bg-white/70 rounded-full blur-lg pointer-events-none"></div>
      <div className="absolute top-1/4 right-8 text-amber-400 text-3xl font-black pointer-events-none animate-pulse">✦</div>
      <div className="absolute bottom-1/3 left-12 text-blue-400 text-2xl font-black pointer-events-none animate-pulse">✦</div>

      {/* Center Pass Container */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-white rounded-[2.5rem] border-2 border-sky-200/80 shadow-2xl overflow-hidden relative z-10"
      >
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-[#0A84FF] via-[#2F93FF] to-[#0A84FF] p-6 sm:p-8 text-white relative text-center">
          {/* Doraemon Logo */}
          <div className="w-16 h-16 rounded-full mx-auto mb-3 shadow-lg border-2 border-white flex items-center justify-center bg-white overflow-hidden">
            <DoraemonHeadIcon className="w-16 h-16" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-heading font-extrabold mb-2 border border-white/30">
            <GoldenBellIcon className="w-3.5 h-3.5" />
            <span>4D Pocket Passport</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight">
            {isSignIn ? "Welcome Back to Gadget Board!" : "Claim Your 4D Pocket Pass"}
          </h1>
          <p className="text-xs sm:text-sm text-sky-100 mt-1 max-w-md mx-auto">
            {isSignIn
              ? "Select your character or enter your credentials to access the shared 22nd-century idea engine."
              : "Create an account to post wishes, upvote ideas, and brainstorm magical gadget solutions!"}
          </p>

          {/* Bottom Collar Ribbon Accent */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 h-3 bg-[#FF4D4D] rounded-full shadow-md flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-[#FFD447] border border-slate-800 shadow-sm"></div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 pt-7">
          {/* Toggle between Quick Persona Pass and Custom Account */}
          <div className="flex rounded-2xl bg-sky-50 p-1.5 border border-sky-200/70 mb-6">
            <button
              type="button"
              onClick={() => setMode("persona")}
              className={`flex-1 py-2 rounded-xl text-xs font-heading font-black transition-all cursor-pointer ${
                mode === "persona"
                  ? "bg-white text-[#0A84FF] shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              ⚡ 1-Click Character Pass
            </button>
            <button
              type="button"
              onClick={() => setMode("custom")}
              className={`flex-1 py-2 rounded-xl text-xs font-heading font-black transition-all cursor-pointer ${
                mode === "custom"
                  ? "bg-white text-[#0A84FF] shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              ✏️ Custom Account
            </button>
          </div>

          {/* MODE 1: 1-Click Persona Pass (Recommended for Judges & Evaluators) */}
          {mode === "persona" && (
            <div className="space-y-4">
              <p className="text-xs font-heading font-bold text-slate-600">
                Choose your collaborative persona to start immediately:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {USER_PERSONAS.map((p) => {
                  const isSelected = selectedPersona.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPersona(p)}
                      className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                        isSelected
                          ? "border-[#0A84FF] bg-sky-50/80 shadow-sm"
                          : "border-slate-200 hover:border-sky-300 bg-white"
                      }`}
                    >
                      <PersonaAvatarBadge avatarKey={p.avatar} size="md" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-heading font-black text-slate-800 flex items-center justify-between">
                          <span>{p.name}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0A84FF]" />}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {p.role}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePersonaSubmit}
                className="w-full mt-4 py-3.5 rounded-full bg-[#0A84FF] hover:bg-[#0073E6] text-white font-heading font-black text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Enter as {selectedPersona.name}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </motion.button>
            </div>
          )}

          {/* MODE 2: Custom Sign Up / Sign In Form */}
          {mode === "custom" && (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold">
                  {formError}
                </div>
              )}

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Your Badge
                </label>
                <div className="flex items-center gap-3">
                  {["nobita", "shizuka", "gian", "suneo", "doraemon"].map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCustomAvatar(key)}
                      className={`p-1 rounded-full border-2 transition-all ${
                        customAvatar === key ? "border-[#0A84FF] ring-2 ring-sky-200" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <PersonaAvatarBadge avatarKey={key} size="md" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name / Nickname
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Dekisugi H."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0A84FF]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0A84FF]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-heading font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Secret Gadget Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0A84FF]"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-3.5 rounded-full bg-[#FF4D4D] hover:bg-[#E83A3A] text-white font-heading font-black text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSubmitting ? "Opening 4D Pocket..." : "Create Pass & Enter"}</span>
              </motion.button>
            </form>
          )}

          {/* Quick Links: Guest and Switch */}
          <div className="mt-6 pt-4 border-t border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <button
              onClick={() => setIsSignIn((prev) => !prev)}
              className="text-[#0A84FF] font-bold hover:underline"
            >
              {isSignIn ? "Need a new 4D Pass? Sign Up" : "Already have a Pass? Sign In"}
            </button>

            <button
              onClick={handleGuestEntry}
              className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1"
            >
              <span>Explore as Guest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
