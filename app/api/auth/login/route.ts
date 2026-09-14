import { NextResponse } from "next/server";
import { COOKIE_NAME, checkPassword, getToken } from "../../../../lib/auth";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    if (!process.env.DASHBOARD_PASSWORD || !process.env.DASHBOARD_TOKEN) {
      return NextResponse.json(
        { error: "Dashboard auth not configured on server" },
        { status: 500 }
      );
    }

    if (!checkPassword(password)) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, getToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
