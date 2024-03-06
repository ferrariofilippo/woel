"use client";

import { Icons } from "@/components/icons";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { ExitIcon } from "@radix-ui/react-icons";
import { createBrowserClient } from "@supabase/ssr";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignOutButton = () => {
  const i18nCommon = useTranslations("Common");
  const i18n = useTranslations("Login");
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const signOut = async () => {
    setIsLoading(true);
    let { error } = await supabase.auth.signOut();
    setIsLoading(false);
    if (error) {
      toast({
        variant: "destructive",
        title: i18nCommon("Error"),
        description: error.message,
      });
      return;
    }
    toast({
      variant: "default",
      description: i18n("SignOutSuccess"),
    });
    router.push("/");
    router.refresh();
  };

  return (
    <DropdownMenuItem className="gap-2" onClick={signOut} disabled={isLoading}>
      <ExitIcon />
      {i18n("SignOut")}
      {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
    </DropdownMenuItem>
  );
};

export default SignOutButton;
