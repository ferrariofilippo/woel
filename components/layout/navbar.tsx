import { Button } from "@/components/ui/button";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { MainNav } from "./navbar/main-nav";
import { UserNav } from "./navbar/user-nav";

const Navbar = async () => {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className={"border-b "}>
      <div className="flex h-16 items-center justify-between">
        <div className="flex gap-10">
          <MainNav />
        </div>
        {user ? (
          <UserNav />
        ) : (
          <div className="ml-auto flex items-center space-x-4 w-fit">
            <a href="/sign-in">
              <Button variant="ghost">Login</Button>
            </a>
            <a href="/sign-in">
              <Button>Sell now</Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export { Navbar };
