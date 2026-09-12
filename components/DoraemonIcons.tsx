import React from "react";

export function PocketPouchIcon({ className = "w-6 h-6", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 48 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Outer pocket curve */}
      <path
        d="M4 6C4 20 12 32 24 32C36 32 44 20 44 6H4Z"
        fill="#FFFFFF"
        stroke="#0A84FF"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Pocket top hem / rim */}
      <line
        x1="4"
        y1="6"
        x2="44"
        y2="6"
        stroke="#0A84FF"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Inner pouch shadow arc */}
      <path
        d="M10 12C12 21 17 26 24 26C31 26 36 21 38 12"
        stroke="#7EC8E3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="2 3"
      />
    </svg>
  );
}

export function GoldenBellIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Bell body */}
      <circle cx="16" cy="16" r="13" fill="#FFD447" stroke="#2E2E2E" strokeWidth="2" />
      {/* Bell collar slit line */}
      <line x1="4" y1="14" x2="28" y2="14" stroke="#2E2E2E" strokeWidth="2" />
      <line x1="5" y1="17" x2="27" y2="17" stroke="#2E2E2E" strokeWidth="1.5" />
      {/* Central bell clapper hole */}
      <circle cx="16" cy="21" r="2.5" fill="#2E2E2E" />
      <line x1="16" y1="23.5" x2="16" y2="28" stroke="#2E2E2E" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function MiniPropellerIcon({ className = "w-6 h-6", animated = false }: { className?: string; animated?: boolean }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${animated ? "animate-spin" : ""}`}
      style={{ animationDuration: "1.2s" }}
    >
      {/* Propeller Mount Stick */}
      <line x1="16" y1="12" x2="16" y2="28" stroke="#FFD447" strokeWidth="3" strokeLinecap="round" />
      {/* Center rotor dot */}
      <circle cx="16" cy="12" r="3" fill="#FF4D4D" stroke="#2E2E2E" strokeWidth="1" />
      {/* Left rotor blade */}
      <path
        d="M16 12C11 9 4 11 3 13C2 15 10 14 16 12Z"
        fill="#FFD447"
        stroke="#2E2E2E"
        strokeWidth="1.2"
      />
      {/* Right rotor blade */}
      <path
        d="M16 12C21 9 28 11 29 13C30 15 22 14 16 12Z"
        fill="#FFD447"
        stroke="#2E2E2E"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export function MagicSparkleIcon({ className = "w-5 h-5", color = "#FFD447" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z"
        fill={color}
      />
    </svg>
  );
}

export function PersonaAvatarBadge({
  avatarKey,
  size = "md",
  className = "",
}: {
  avatarKey?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizeClasses = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
    xl: "w-14 h-14 text-lg",
  }[size];

  switch (avatarKey) {
    case "nobita":
      return (
        <div
          className={`${sizeClasses} rounded-full bg-amber-100 border-2 border-amber-400 flex items-center justify-center font-bold text-amber-800 shadow-sm relative overflow-hidden select-none ${className}`}
          title="Nobita N."
        >
          {/* Stylized round glasses motif */}
          <span className="font-heading font-extrabold tracking-tighter">👓 N</span>
        </div>
      );
    case "shizuka":
      return (
        <div
          className={`${sizeClasses} rounded-full bg-rose-100 border-2 border-rose-400 flex items-center justify-center font-bold text-rose-700 shadow-sm relative overflow-hidden select-none ${className}`}
          title="Shizuka M."
        >
          {/* Stylized pink ribbon motif */}
          <span className="font-heading font-extrabold tracking-tighter">🎀 S</span>
        </div>
      );
    case "gian":
      return (
        <div
          className={`${sizeClasses} rounded-full bg-orange-100 border-2 border-orange-500 flex items-center justify-center font-bold text-orange-800 shadow-sm relative overflow-hidden select-none ${className}`}
          title="Takeshi 'Gian' G."
        >
          {/* Stylized megaphone motif */}
          <span className="font-heading font-extrabold tracking-tighter">📢 G</span>
        </div>
      );
    case "suneo":
      return (
        <div
          className={`${sizeClasses} rounded-full bg-sky-100 border-2 border-sky-400 flex items-center justify-center font-bold text-sky-800 shadow-sm relative overflow-hidden select-none ${className}`}
          title="Suneo H."
        >
          {/* Stylized tech collector motif */}
          <span className="font-heading font-extrabold tracking-tighter">🎮 S</span>
        </div>
      );
    case "doraemon":
    default:
      return (
        <div
          className={`${sizeClasses} rounded-full bg-blue-500 border-2 border-white flex items-center justify-center font-bold text-white shadow-md relative overflow-hidden select-none ring-2 ring-blue-300 ${className}`}
          title="Doraemon"
        >
          {/* Blue circle with tiny red collar ribbon */}
          <div className="flex flex-col items-center justify-center">
            <span className="font-heading font-extrabold text-[11px] leading-none">✨</span>
            <div className="w-2.5 h-0.5 bg-red-500 rounded-full mt-0.5"></div>
          </div>
        </div>
      );
  }
}
