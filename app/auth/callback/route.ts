import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }
  if (next) {
    return NextResponse.redirect(new URL(next, req.url));
  }
  return NextResponse.redirect(new URL("/account", req.url));
}
