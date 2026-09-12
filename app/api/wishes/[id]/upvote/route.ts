import { NextRequest, NextResponse } from "next/server";
import { toggleUpvote } from "@/lib/serverStore";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const userId = body.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required to upvote" },
        { status: 400 }
      );
    }

    const result = await toggleUpvote(id, userId);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to toggle upvote" },
      { status: 500 }
    );
  }
}
