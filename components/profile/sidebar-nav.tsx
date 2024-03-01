"use client";

import * as changeCase from "change-case";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();
  const i18nCommon = useTranslations("Common");
  return (
    <nav
      className={cn(
        "flex lg:flex-col lg:space-x-0 lg:space-y-1 justify-center xl:justify-normal",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          {i18nCommon(changeCase.sentenceCase(item.title))}
        </Link>
      ))}
    </nav>
  );
}
