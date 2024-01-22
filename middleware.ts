import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { getUserByID } from "./lib/api/user";
import { UserData } from "./types/api";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user && req.nextUrl.pathname !== "/sign-in") {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
  if (user) {
    const userData: UserData = await getUserByID(user?.id);
    if (
      userData?.username === null &&
      req.nextUrl.pathname !== "/sign-in/complete-profile"
    ) {
      return NextResponse.redirect(
        new URL("/sign-in/complete-profile", req.url)
      );
    }
  }
  return res;
}

export const config = {
  matcher: ["/", "/account"],
};
