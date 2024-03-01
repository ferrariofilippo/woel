import { createServerClient, type CookieOptions } from "@supabase/ssr";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getUserByID } from "./lib/api/user";
import { UserData } from "./types/api";

export async function middleware(req: NextRequest) {
  const handleI18nRouting = createIntlMiddleware({
    locales: ["en", "it"],
    defaultLocale: "en",
  });

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
            value: "",
            ...options,
          });
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          res.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !req.nextUrl.pathname.includes("/sign-in")) {
    req.nextUrl.pathname = "/sign-in";
  }

  if (user) {
    const userData: UserData = await getUserByID(user?.id);
    if (
      userData?.username === null &&
      req.nextUrl.pathname.includes("/sign-in/complete-profile")
    ) {
      req.nextUrl.pathname = "/sign-in/complete-profile";
    } else if (req.nextUrl.pathname.includes("sign-in")) {
      req.nextUrl.pathname = "/";
    }
  }
  req.headers.set("pathname", req.nextUrl.pathname);
  return handleI18nRouting(req);
}
export const config = {
  // Matcher entries are linked with a logical "or", therefore
  // if one of them matches, the middleware will be invoked.
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
    // However, match all pathnames within `/users`, optionally with a locale prefix
    "/([\\w-]+)?/users/(.+)",
  ],
};
