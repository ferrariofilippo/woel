import { Logo } from "@/components/layout/navbar/logo";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign-In",
  description: "Advanced form example using react-hook-form and Zod.",
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SignInLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="flex h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 h-svh">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link className="flex items-center" href="/">
            <Logo />
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">&ldquo;Hi.&rdquo;</p>
            {/* <footer className="text-sm">Sofia Davis</footer> */}
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex align-middle w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {children}
        </div>
      </div>
    </div>
  );
}
