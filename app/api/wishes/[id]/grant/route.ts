import { NextRequest, NextResponse } from "next/server";
import { grantWish } from "@/lib/serverStore";
import { grantWishSchema } from "@/lib/validation";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const validated = grantWishSchema.parse(body);
    const user = {
      id: body.user_id || "user-doraemon",
      name: body.user_name || "Doraemon (Host)",
      avatar: body.user_avatar || "doraemon",
    };

    const result = await grantWish(id, validated, user);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
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
      { success: false, error: error.message || "Failed to grant wish" },
      { status: 500 }
    );
  }
}
