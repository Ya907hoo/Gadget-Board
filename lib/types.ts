export type WishCategory = 
  | "Daily Life"
  | "Study & School"
  | "Travel & Time"
  | "Secret Gadgets"
  | "Food & Dorayaki"
  | "Fun & Mischief";

export type WishStatus = "open" | "granted";

export interface Wish {
  id: string;
  title: string;
  description: string;
  category: WishCategory;
  status: WishStatus;
  image_url?: string | null;
  creator_id: string;
  creator_name: string;
  creator_avatar?: string | null;
  upvotes_count: number;
  granted_gadget_name?: string | null;
  granted_at?: string | null;
  created_at: string;
  updated_at: string;
  has_upvoted?: boolean;
}

export interface WishComment {
  id: string;
  wish_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string | null;
  content: string;
  is_gadget_solution: boolean;
  gadget_name?: string | null;
  created_at: string;
}

export interface UserPersona {
  id: string;
  name: string;
  avatar: string;
  role: string;
  bio: string;
  themeColor: string;
}

export type SortFilter = "upvotes" | "newest" | "oldest";
export type StatusFilter = "all" | "open" | "granted";

export interface CreateWishInput {
  title: string;
  description: string;
  category: WishCategory;
  image_url?: string | null;
  creator_id: string;
  creator_name: string;
  creator_avatar?: string | null;
}

export interface UpdateWishInput {
  title: string;
  description: string;
  category: WishCategory;
  image_url?: string | null;
}

export interface GrantWishInput {
  granted_gadget_name: string;
  comment?: string | null;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
