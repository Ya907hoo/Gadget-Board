import { NextRequest, NextResponse } from "next/server";
import { deleteWish, fetchWishById, updateWish } from "@/lib/serverStore";
import { updateWishSchema } from "@/lib/validation";
import { WishCategory } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;

    const wish = await fetchWishById(id, userId);
    if (!wish) {
      return NextResponse.json(
        { success: false, error: "Wish not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: wish });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch wish" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const userId = body.userId || body.creator_id;
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required to edit wish" },
        { status: 401 }
      );
    }

    const validated = updateWishSchema.parse(body);

    const result = await updateWish(
      id,
      {
        title: validated.title,
        description: validated.description,
        category: validated.category as WishCategory,
        image_url: validated.image_url,
      },
      userId
    );

    if (!result.success) {
      const status = result.error?.includes("Unauthorized") ? 403 : 404;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    if (error.errors) {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update wish" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required to delete wish" },
        { status: 401 }
      );
    }

    const result = await deleteWish(id, userId);
    if (!result.success) {
      const status = result.error?.includes("Unauthorized") ? 403 : 404;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete wish" },
      { status: 500 }
    );
  }
}
