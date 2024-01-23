import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, NextRequest } from "next/server";
import { getUserByID } from "./lib/api/user";
import { UserData } from "./types/api";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        }
      },
    }
  );

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
