import { registerUser } from "@/app/actions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await registerUser(body);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as Error;
    console.log("[REGISTER_API_ERROR]", err);

    return NextResponse.json(
      { success: false, message: err.message || "Ошибка при регистрации" },
      { status: 400 }
    );
  }
}
