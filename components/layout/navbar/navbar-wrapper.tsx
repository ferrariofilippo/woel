"use client";

import { usePathname } from "next/navigation";

import { hiddenNavbarRoutes } from "@/lib/costants";

export function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <div>{!isNavbarHidden(pathname) && children}</div>;
}
const isNavbarHidden = (pathname: string) => {
  let ret = false;
  hiddenNavbarRoutes.forEach((path: string) => {
    if (pathname.includes(path)) ret = true;
  });
  return ret;
};
