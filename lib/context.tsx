"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useTransition } from "react";
import {
  CreateWishInput,
  GrantWishInput,
  SortFilter,
  StatusFilter,
  UpdateWishInput,
  UserPersona,
  Wish,
  WishCategory,
} from "./types";
import { USER_PERSONAS } from "./seed-data";
import { isSupabaseConfigured, supabase } from "./supabaseClient";

interface AppContextType {
  currentUser: UserPersona;
  setCurrentUser: (user: UserPersona) => void;
  wishes: Wish[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLiveConnected: boolean;
  lastLiveEvent: string | null;

  // Filters
  category: WishCategory | "All";
  setCategory: (cat: WishCategory | "All") => void;
  status: StatusFilter;
  setStatus: (s: StatusFilter) => void;
  search: string;
  setSearch: (q: string) => void;
  sort: SortFilter;
  setSort: (s: SortFilter) => void;

  // Modals & Interactivity
  isNewWishModalOpen: boolean;
  setIsNewWishModalOpen: (open: boolean) => void;
  editingWish: Wish | null;
  setEditingWish: (wish: Wish | null) => void;
  selectedWishForDetail: Wish | null;
  setSelectedWishForDetail: (wish: Wish | null) => void;
  celebratingWish: Wish | null;
  setCelebratingWish: (wish: Wish | null) => void;

  // Auth & Session
  isAuthenticated: boolean;
  login: (user: UserPersona) => void;
  signup: (user: UserPersona) => void;
  logout: () => void;

  // Actions
  refreshWishes: () => Promise<void>;
  createWishAction: (input: { title: string; description: string; category: WishCategory; image_url?: string | null }) => Promise<{ success: boolean; error?: string }>;
  updateWishAction: (id: string, input: UpdateWishInput) => Promise<{ success: boolean; error?: string }>;
  deleteWishAction: (id: string) => Promise<{ success: boolean; error?: string }>;
  toggleUpvoteAction: (wishId: string) => Promise<{ success: boolean; upvotes_count: number; has_upvoted: boolean; error?: string }>;
  grantWishAction: (wishId: string, input: GrantWishInput) => Promise<{ success: boolean; error?: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserPersona>(USER_PERSONAS[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [lastLiveEvent, setLastLiveEvent] = useState<string | null>(null);

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("gadget_board_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error("Error loading user session:", e);
    }
  }, []);

  const login = (user: UserPersona) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    try {
      localStorage.setItem("gadget_board_user", JSON.stringify(user));
    } catch {}
  };

  const signup = (user: UserPersona) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    try {
      localStorage.setItem("gadget_board_user", JSON.stringify(user));
    } catch {}
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(USER_PERSONAS[0]);
    try {
      localStorage.removeItem("gadget_board_user");
    } catch {}
  };

  // Filters
  const [category, setCategory] = useState<WishCategory | "All">("All");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortFilter>("upvotes");

  // Modals
  const [isNewWishModalOpen, setIsNewWishModalOpen] = useState(false);
  const [editingWish, setEditingWish] = useState<Wish | null>(null);
  const [selectedWishForDetail, setSelectedWishForDetail] = useState<Wish | null>(null);
  const [celebratingWish, setCelebratingWish] = useState<Wish | null>(null);

  // Fetch wishes from API
  const fetchBoardWishes = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    try {
      const params = new URLSearchParams();
      if (category !== "All") params.set("category", category);
      if (status !== "all") params.set("status", status);
      if (search.trim()) params.set("search", search.trim());
      params.set("sort", sort);
      if (currentUser?.id) params.set("userId", currentUser.id);

      const res = await fetch(`/api/wishes?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch wishes");
      const json = await res.json();
      if (json.success) {
        setWishes(json.data || []);
      }
    } catch (err) {
      console.error("Error fetching wishes:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [category, status, search, sort, currentUser?.id]);

  // Initial load and refetch on filter change
  useEffect(() => {
    fetchBoardWishes();
  }, [fetchBoardWishes]);

  // Setup Real-time Listener (Supabase Realtime or BroadcastChannel fallback)
  useEffect(() => {
    let channel: any = null;
    let bc: BroadcastChannel | null = null;

    if (isSupabaseConfigured() && supabase) {
      setIsLiveConnected(true);
      channel = supabase
        .channel("realtime-wishes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "wishes" },
          (payload) => {
            setLastLiveEvent(`Live update: ${payload.eventType}`);
            fetchBoardWishes(true);
            setTimeout(() => setLastLiveEvent(null), 3000);
          }
        )
        .subscribe();
    } else {
      // Local cross-tab broadcast channel
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        bc = new BroadcastChannel("gadget_board_sync");
        setIsLiveConnected(true);
        bc.onmessage = (event) => {
          if (event.data?.type === "MUTATION") {
            setLastLiveEvent(`Sync: ${event.data.action}`);
            fetchBoardWishes(true);
            setTimeout(() => setLastLiveEvent(null), 3000);
          }
        };
      }
    }

    return () => {
      if (channel && supabase) supabase.removeChannel(channel);
      if (bc) bc.close();
    };
  }, [fetchBoardWishes]);

  const notifyBroadcast = (action: string) => {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const bc = new BroadcastChannel("gadget_board_sync");
      bc.postMessage({ type: "MUTATION", action, timestamp: Date.now() });
      bc.close();
    }
  };

  // Actions
  const createWishAction = async (input: {
    title: string;
    description: string;
    category: WishCategory;
    image_url?: string | null;
  }) => {
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...input,
          creator_id: currentUser.id,
          creator_name: currentUser.name,
          creator_avatar: currentUser.avatar,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Failed to submit wish" };
      }

      await fetchBoardWishes();
      notifyBroadcast("New Wish Added");
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Network error" };
    }
  };

  const updateWishAction = async (id: string, input: UpdateWishInput) => {
    try {
      const res = await fetch(`/api/wishes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...input,
          userId: currentUser.id,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Failed to update wish" };
      }

      await fetchBoardWishes();
      notifyBroadcast("Wish Updated");
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Network error" };
    }
  };

  const deleteWishAction = async (id: string) => {
    try {
      const res = await fetch(`/api/wishes/${id}?userId=${encodeURIComponent(currentUser.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Failed to delete wish" };
      }

      // Optimistic delete
      setWishes((prev) => prev.filter((w) => w.id !== id));
      notifyBroadcast("Wish Removed");
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Network error" };
    }
  };

  const toggleUpvoteAction = async (wishId: string) => {
    // Optimistic UI update
    setWishes((prev) =>
      prev.map((w) => {
        if (w.id === wishId) {
          const currentlyUpvoted = Boolean(w.has_upvoted);
          return {
            ...w,
            has_upvoted: !currentlyUpvoted,
            upvotes_count: currentlyUpvoted ? Math.max(0, w.upvotes_count - 1) : w.upvotes_count + 1,
          };
        }
        return w;
      })
    );

    try {
      const res = await fetch(`/api/wishes/${wishId}/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        // Revert on failure
        fetchBoardWishes();
        return { success: false, upvotes_count: 0, has_upvoted: false, error: data.error };
      }

      // Reconcile with server response
      setWishes((prev) =>
        prev.map((w) =>
          w.id === wishId
            ? { ...w, upvotes_count: data.upvotes_count, has_upvoted: data.has_upvoted }
            : w
        )
      );
      notifyBroadcast("Upvote");
      return { success: true, upvotes_count: data.upvotes_count, has_upvoted: data.has_upvoted };
    } catch (e: any) {
      fetchBoardWishes();
      return { success: false, upvotes_count: 0, has_upvoted: false, error: e.message };
    }
  };

  const grantWishAction = async (wishId: string, input: GrantWishInput) => {
    try {
      const res = await fetch(`/api/wishes/${wishId}/grant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...input,
          user_id: currentUser.id,
          user_name: currentUser.name,
          user_avatar: currentUser.avatar,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || "Failed to grant wish" };
      }

      // Set celebratory state
      if (data.data) {
        setCelebratingWish(data.data);
      }

      await fetchBoardWishes();
      notifyBroadcast("Wish Granted");
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Network error" };
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated,
        login,
        signup,
        logout,
        wishes,
        isLoading,
        isRefreshing,
        isLiveConnected,
        lastLiveEvent,
        category,
        setCategory,
        status,
        setStatus,
        search,
        setSearch,
        sort,
        setSort,
        isNewWishModalOpen,
        setIsNewWishModalOpen,
        editingWish,
        setEditingWish,
        selectedWishForDetail,
        setSelectedWishForDetail,
        celebratingWish,
        setCelebratingWish,
        refreshWishes: fetchBoardWishes,
        createWishAction,
        updateWishAction,
        deleteWishAction,
        toggleUpvoteAction,
        grantWishAction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
