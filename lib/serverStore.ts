import { isSupabaseConfigured, supabase } from "./supabaseClient";
import { INITIAL_COMMENTS, INITIAL_WISHES } from "./seed-data";
import {
  CreateWishInput,
  GrantWishInput,
  SortFilter,
  StatusFilter,
  UpdateWishInput,
  Wish,
  WishCategory,
  WishComment,
} from "./types";

// In-memory persistent store for server-side fallback
declare global {
  // eslint-disable-next-line no-var
  var __GADGET_STORE__: {
    wishes: Wish[];
    comments: WishComment[];
    upvotes: Map<string, Set<string>>; // wish_id -> Set of user_ids
  } | undefined;
}

function getFallbackStore() {
  if (!global.__GADGET_STORE__) {
    const upvotesMap = new Map<string, Set<string>>();
    // seed initial upvotes
    upvotesMap.set("11111111-1111-1111-1111-111111111111", new Set(["user-nobita", "user-shizuka"]));
    upvotesMap.set("22222222-2222-2222-2222-222222222222", new Set(["user-nobita", "user-gian"]));
    upvotesMap.set("33333333-3333-3333-3333-333333333333", new Set(["user-shizuka", "user-doraemon"]));
    upvotesMap.set("44444444-4444-4444-4444-444444444444", new Set(["user-suneo"]));
    upvotesMap.set("55555555-5555-5555-5555-555555555555", new Set(["user-doraemon"]));
    upvotesMap.set("66666666-6666-6666-6666-666666666666", new Set(["user-gian"]));
    upvotesMap.set("77777777-7777-7777-7777-777777777777", new Set(["user-shizuka"]));

    global.__GADGET_STORE__ = {
      wishes: [...INITIAL_WISHES],
      comments: [...INITIAL_COMMENTS],
      upvotes: upvotesMap,
    };
  }
  return global.__GADGET_STORE__;
}

export async function fetchWishes(params: {
  category?: string;
  status?: StatusFilter;
  search?: string;
  sort?: SortFilter;
  userId?: string;
}): Promise<Wish[]> {
  const { category, status = "all", search = "", sort = "upvotes", userId } = params;

  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from("wishes").select("*");

      if (category && category !== "All") {
        query = query.eq("category", category);
      }
      if (status && status !== "all") {
        query = query.eq("status", status);
      }
      if (search && search.trim()) {
        const term = `%${search.trim()}%`;
        query = query.or(`title.ilike.${term},description.ilike.${term}`);
      }

      if (sort === "upvotes") {
        query = query.order("upvotes_count", { ascending: false });
      } else if (sort === "newest") {
        query = query.order("created_at", { ascending: false });
      } else if (sort === "oldest") {
        query = query.order("created_at", { ascending: true });
      }

      const { data, error } = await query;
      if (error) throw error;

      let upvotedWishIds = new Set<string>();
      if (userId) {
        const { data: userVotes } = await supabase
          .from("wish_upvotes")
          .select("wish_id")
          .eq("user_id", userId);
        if (userVotes) {
          upvotedWishIds = new Set(userVotes.map((v) => v.wish_id));
        }
      }

      return (data || []).map((w) => ({
        ...w,
        has_upvoted: userId ? upvotedWishIds.has(w.id) : false,
      }));
    } catch (e) {
      console.warn("Supabase fetch failed, falling back to local store:", e);
    }
  }

  // Local fallback
  const store = getFallbackStore();
  let result = [...store.wishes];

  if (category && category !== "All") {
    result = result.filter((w) => w.category === category);
  }
  if (status && status !== "all") {
    result = result.filter((w) => w.status === status);
  }
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    result = result.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        (w.granted_gadget_name && w.granted_gadget_name.toLowerCase().includes(q))
    );
  }

  if (sort === "upvotes") {
    result.sort((a, b) => b.upvotes_count - a.upvotes_count);
  } else if (sort === "newest") {
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (sort === "oldest") {
    result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  return result.map((w) => {
    const userUpvotes = store.upvotes.get(w.id);
    return {
      ...w,
      has_upvoted: userId && userUpvotes ? userUpvotes.has(userId) : false,
    };
  });
}

export async function fetchWishById(id: string, userId?: string): Promise<Wish | null> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("wishes")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      if (!data) return null;

      let has_upvoted = false;
      if (userId) {
        const { data: vote } = await supabase
          .from("wish_upvotes")
          .select("id")
          .eq("wish_id", id)
          .eq("user_id", userId)
          .maybeSingle();
        has_upvoted = Boolean(vote);
      }

      return {
        ...data,
        has_upvoted,
      };
    } catch (e) {
      console.warn("Supabase fetch single wish failed, using local store:", e);
    }
  }

  const store = getFallbackStore();
  const wish = store.wishes.find((w) => w.id === id);
  if (!wish) return null;

  const userVotes = store.upvotes.get(id);
  return {
    ...wish,
    has_upvoted: userId && userVotes ? userVotes.has(userId) : false,
  };
}

export async function createWish(input: CreateWishInput): Promise<Wish> {
  const newWish: Wish = {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `wish-${Date.now()}`,
    title: input.title,
    description: input.description,
    category: input.category,
    status: "open",
    image_url: input.image_url || null,
    creator_id: input.creator_id,
    creator_name: input.creator_name,
    creator_avatar: input.creator_avatar || null,
    upvotes_count: 0,
    granted_gadget_name: null,
    granted_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    has_upvoted: false,
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("wishes")
        .insert({
          title: newWish.title,
          description: newWish.description,
          category: newWish.category,
          status: newWish.status,
          image_url: newWish.image_url,
          creator_id: newWish.creator_id,
          creator_name: newWish.creator_name,
          creator_avatar: newWish.creator_avatar,
          upvotes_count: 0,
        })
        .select()
        .single();
      if (error) throw error;
      return { ...data, has_upvoted: false };
    } catch (e) {
      console.warn("Supabase insert wish failed, saving to local store:", e);
    }
  }

  const store = getFallbackStore();
  store.wishes.unshift(newWish);
  store.upvotes.set(newWish.id, new Set());
  return newWish;
}

export async function updateWish(
  id: string,
  input: UpdateWishInput,
  userId: string
): Promise<{ success: boolean; data?: Wish; error?: string }> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: existing, error: fetchErr } = await supabase
        .from("wishes")
        .select("creator_id")
        .eq("id", id)
        .single();
      if (fetchErr || !existing) return { success: false, error: "Wish not found" };
      if (existing.creator_id !== userId) {
        return { success: false, error: "Unauthorized: Only the wish creator can edit this wish." };
      }

      const { data, error } = await supabase
        .from("wishes")
        .update({
          title: input.title,
          description: input.description,
          category: input.category,
          image_url: input.image_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (e: any) {
      console.warn("Supabase update wish failed:", e);
      return { success: false, error: e.message || "Failed to update wish" };
    }
  }

  const store = getFallbackStore();
  const index = store.wishes.findIndex((w) => w.id === id);
  if (index === -1) return { success: false, error: "Wish not found" };

  const wish = store.wishes[index];
  if (wish.creator_id !== userId) {
    return { success: false, error: "Unauthorized: Only the creator can edit this wish." };
  }

  const updated: Wish = {
    ...wish,
    title: input.title,
    description: input.description,
    category: input.category,
    image_url: input.image_url !== undefined ? input.image_url : wish.image_url,
    updated_at: new Date().toISOString(),
  };
  store.wishes[index] = updated;
  return { success: true, data: updated };
}

export async function deleteWish(
  id: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: existing, error: fetchErr } = await supabase
        .from("wishes")
        .select("creator_id")
        .eq("id", id)
        .single();
      if (fetchErr || !existing) return { success: false, error: "Wish not found" };
      if (existing.creator_id !== userId) {
        return { success: false, error: "Unauthorized: Only the creator can delete this wish." };
      }

      const { error } = await supabase.from("wishes").delete().eq("id", id);
      if (error) throw error;
      return { success: true };
    } catch (e: any) {
      console.warn("Supabase delete failed:", e);
      return { success: false, error: e.message || "Failed to delete wish" };
    }
  }

  const store = getFallbackStore();
  const index = store.wishes.findIndex((w) => w.id === id);
  if (index === -1) return { success: false, error: "Wish not found" };

  const wish = store.wishes[index];
  if (wish.creator_id !== userId) {
    return { success: false, error: "Unauthorized: Only the creator can delete this wish." };
  }

  store.wishes.splice(index, 1);
  store.upvotes.delete(id);
  store.comments = store.comments.filter((c) => c.wish_id !== id);
  return { success: true };
}

export async function toggleUpvote(
  wishId: string,
  userId: string
): Promise<{ success: boolean; upvotes_count: number; has_upvoted: boolean; error?: string }> {
  if (!userId) {
    return { success: false, upvotes_count: 0, has_upvoted: false, error: "User ID required" };
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data: existingVote } = await supabase
        .from("wish_upvotes")
        .select("id")
        .eq("wish_id", wishId)
        .eq("user_id", userId)
        .maybeSingle();

      if (existingVote) {
        // Remove vote
        await supabase.from("wish_upvotes").delete().eq("id", existingVote.id);
        const { data: wish } = await supabase.from("wishes").select("upvotes_count").eq("id", wishId).single();
        const newCount = Math.max(0, (wish?.upvotes_count || 1) - 1);
        await supabase.from("wishes").update({ upvotes_count: newCount }).eq("id", wishId);
        return { success: true, upvotes_count: newCount, has_upvoted: false };
      } else {
        // Add vote
        await supabase.from("wish_upvotes").insert({ wish_id: wishId, user_id: userId });
        const { data: wish } = await supabase.from("wishes").select("upvotes_count").eq("id", wishId).single();
        const newCount = (wish?.upvotes_count || 0) + 1;
        await supabase.from("wishes").update({ upvotes_count: newCount }).eq("id", wishId);
        return { success: true, upvotes_count: newCount, has_upvoted: true };
      }
    } catch (e: any) {
      console.warn("Supabase toggle upvote failed, falling back to memory:", e);
    }
  }

  const store = getFallbackStore();
  const wish = store.wishes.find((w) => w.id === wishId);
  if (!wish) return { success: false, upvotes_count: 0, has_upvoted: false, error: "Wish not found" };

  if (!store.upvotes.has(wishId)) {
    store.upvotes.set(wishId, new Set());
  }

  const votes = store.upvotes.get(wishId)!;
  let has_upvoted = false;
  if (votes.has(userId)) {
    votes.delete(userId);
    wish.upvotes_count = Math.max(0, wish.upvotes_count - 1);
    has_upvoted = false;
  } else {
    votes.add(userId);
    wish.upvotes_count += 1;
    has_upvoted = true;
  }

  return { success: true, upvotes_count: wish.upvotes_count, has_upvoted };
}

export async function grantWish(
  wishId: string,
  input: GrantWishInput,
  user: { id: string; name: string; avatar?: string }
): Promise<{ success: boolean; data?: Wish; error?: string }> {
  const grantedGadget = input.granted_gadget_name.trim();
  const now = new Date().toISOString();

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("wishes")
        .update({
          status: "granted",
          granted_gadget_name: grantedGadget,
          granted_at: now,
          updated_at: now,
        })
        .eq("id", wishId)
        .select()
        .single();
      if (error) throw error;

      // Add celebratory comment
      await supabase.from("wish_comments").insert({
        wish_id: wishId,
        user_id: user.id,
        user_name: user.name,
        user_avatar: user.avatar || "doraemon",
        content: input.comment || `✨ Wish granted using the magical 22nd-century gadget: ${grantedGadget}!`,
        is_gadget_solution: true,
        gadget_name: grantedGadget,
      });

      return { success: true, data };
    } catch (e: any) {
      console.warn("Supabase grant wish failed:", e);
    }
  }

  const store = getFallbackStore();
  const wish = store.wishes.find((w) => w.id === wishId);
  if (!wish) return { success: false, error: "Wish not found" };

  wish.status = "granted";
  wish.granted_gadget_name = grantedGadget;
  wish.granted_at = now;
  wish.updated_at = now;

  // Add solution comment
  const comment: WishComment = {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `comm-${Date.now()}`,
    wish_id: wishId,
    user_id: user.id,
    user_name: user.name,
    user_avatar: user.avatar || "doraemon",
    content: input.comment || `✨ Wish granted using the 22nd-century gadget: ${grantedGadget}!`,
    is_gadget_solution: true,
    gadget_name: grantedGadget,
    created_at: now,
  };
  store.comments.unshift(comment);

  return { success: true, data: wish };
}

export async function fetchComments(wishId: string): Promise<WishComment[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("wish_comments")
        .select("*")
        .eq("wish_id", wishId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.warn("Supabase fetch comments failed:", e);
    }
  }

  const store = getFallbackStore();
  return store.comments
    .filter((c) => c.wish_id === wishId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export async function addComment(
  wishId: string,
  input: {
    content: string;
    is_gadget_solution: boolean;
    gadget_name?: string | null;
    user_id: string;
    user_name: string;
    user_avatar?: string | null;
  }
): Promise<WishComment> {
  const newComment: WishComment = {
    id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `comm-${Date.now()}`,
    wish_id: wishId,
    user_id: input.user_id,
    user_name: input.user_name,
    user_avatar: input.user_avatar || null,
    content: input.content,
    is_gadget_solution: input.is_gadget_solution,
    gadget_name: input.gadget_name || null,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("wish_comments")
        .insert({
          wish_id: newComment.wish_id,
          user_id: newComment.user_id,
          user_name: newComment.user_name,
          user_avatar: newComment.user_avatar,
          content: newComment.content,
          is_gadget_solution: newComment.is_gadget_solution,
          gadget_name: newComment.gadget_name,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (e) {
      console.warn("Supabase add comment failed:", e);
    }
  }

  const store = getFallbackStore();
  store.comments.push(newComment);
  return newComment;
}
