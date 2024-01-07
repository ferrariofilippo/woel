"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { createBrowserClient } from "@supabase/ssr";
import { Icons } from "@/components/icons";

const SignOutButton = () => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setIsLoading(false);
    router.refresh();
  };

  return (
    <DropdownMenuItem onClick={signOut} disabled={isLoading}>
      Esci
      {isLoading && (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      )}{" "}
    </DropdownMenuItem>
  );
};

export default SignOutButton;
