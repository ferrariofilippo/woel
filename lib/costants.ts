// const mainNav = [{ path: "/", name: "Home" }];
export const BASE_URL = process.env.NEXT_PUBLIC_APP_DOMAIN;
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const hiddenNavbarRoutes: string[] = ["/sign-in"];

export const profileSidebarNavItems = [
  {
    title: "Account",
    href: "/account",
  },
  {
    title: "Appearance",
    href: "/account/appearence",
  },
];
export enum SignInProviders {
  Github,
  Google,
  Discord,
}
