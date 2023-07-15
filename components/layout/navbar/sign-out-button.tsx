"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Icons } from "@/components/icons";

const SignOutButton = () => {
  const supabase = createClientComponentClient();
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
      Log out
      {isLoading && (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      )}{" "}
    </DropdownMenuItem>
  );
};

export default SignOutButton;
