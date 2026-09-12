import { z } from "zod";

export const CATEGORIES = [
  "Daily Life",
  "Study & School",
  "Travel & Time",
  "Secret Gadgets",
  "Food & Dorayaki",
  "Fun & Mischief",
] as const;

export const createWishSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(120, "Title cannot exceed 120 characters"),
  description: z
    .string()
    .min(10, "Please describe your wish in at least 10 characters")
    .max(1200, "Description cannot exceed 1200 characters"),
  category: z.enum(CATEGORIES, {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  image_url: z
    .string()
    .url("Please provide a valid image URL")
    .or(z.literal(""))
    .optional()
    .nullable(),
});

export const updateWishSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(120, "Title cannot exceed 120 characters"),
  description: z
    .string()
    .min(10, "Please describe your wish in at least 10 characters")
    .max(1200, "Description cannot exceed 1200 characters"),
  category: z.enum(CATEGORIES, {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  image_url: z
    .string()
    .url("Please provide a valid image URL")
    .or(z.literal(""))
    .optional()
    .nullable(),
});

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(2, "Comment must be at least 2 characters")
    .max(500, "Comment cannot exceed 500 characters"),
  is_gadget_solution: z.boolean().default(false),
  gadget_name: z.string().max(100).optional().nullable(),
});

export const grantWishSchema = z.object({
  granted_gadget_name: z
    .string()
    .min(2, "Gadget name must be at least 2 characters")
    .max(100, "Gadget name cannot exceed 100 characters"),
  comment: z.string().max(500).optional().nullable(),
});
