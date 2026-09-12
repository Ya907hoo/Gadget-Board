import { NextRequest, NextResponse } from "next/server";
import { createWish, fetchWishes } from "@/lib/serverStore";
import { createWishSchema } from "@/lib/validation";
import { SortFilter, StatusFilter, WishCategory } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const status = (searchParams.get("status") as StatusFilter) || "all";
    const search = searchParams.get("search") || "";
    const sort = (searchParams.get("sort") as SortFilter) || "upvotes";
    const userId = searchParams.get("userId") || undefined;

    const wishes = await fetchWishes({
      category,
      status,
      search,
      sort,
      userId,
    });

    return NextResponse.json({ success: true, data: wishes });
  } catch (error: any) {
    console.error("Error in GET /api/wishes:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load wishes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate body
    const validated = createWishSchema.parse(body);

    const creator_id = body.creator_id;
    const creator_name = body.creator_name;
    const creator_avatar = body.creator_avatar;

    if (!creator_id || !creator_name) {
      return NextResponse.json(
        { success: false, error: "Creator ID and Name are required" },
        { status: 400 }
      );
    }

    const newWish = await createWish({
      title: validated.title,
      description: validated.description,
      category: validated.category as WishCategory,
      image_url: validated.image_url,
      creator_id,
      creator_name,
      creator_avatar,
    });

    return NextResponse.json({ success: true, data: newWish }, { status: 201 });
  } catch (error: any) {
    if (error.errors) {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }
    console.error("Error in POST /api/wishes:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create wish" },
      { status: 500 }
    );
  }
}
