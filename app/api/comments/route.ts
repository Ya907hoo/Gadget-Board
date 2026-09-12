import { NextRequest, NextResponse } from "next/server";
import { addComment, fetchComments } from "@/lib/serverStore";
import { createCommentSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const wishId = searchParams.get("wishId");

    if (!wishId) {
      return NextResponse.json(
        { success: false, error: "wishId query param is required" },
        { status: 400 }
      );
    }

    const comments = await fetchComments(wishId);
    return NextResponse.json({ success: true, data: comments });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load comments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const wishId = body.wishId;

    if (!wishId) {
      return NextResponse.json(
        { success: false, error: "wishId is required" },
        { status: 400 }
      );
    }

    const validated = createCommentSchema.parse(body);

    const user_id = body.user_id || "guest";
    const user_name = body.user_name || "Guest Friend";
    const user_avatar = body.user_avatar || "nobita";

    const comment = await addComment(wishId, {
      content: validated.content,
      is_gadget_solution: validated.is_gadget_solution,
      gadget_name: validated.gadget_name,
      user_id,
      user_name,
      user_avatar,
    });

    return NextResponse.json({ success: true, data: comment }, { status: 201 });
  } catch (error: any) {
    if (error.errors) {
      return NextResponse.json(
        { success: false, error: error.errors[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add comment" },
      { status: 500 }
    );
  }
}
