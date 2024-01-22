"use client";
import { Icons } from "@/components/icons";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { ExitIcon } from "@radix-ui/react-icons";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
const SignOutButton = () => {
  const supabase = createClientComponentClient();
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
        title: "Error",
        description: error.message,
      });
      return;
    }
    toast({
      variant: "default",
      description: "Signed out succesfully!",
    });
    router.push("/");
    router.refresh();
  };
  return (
    <DropdownMenuItem className="gap-2" onClick={signOut} disabled={isLoading}>
      <ExitIcon />
      Sign out
      {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
    </DropdownMenuItem>
  );
};

export default SignOutButton;
