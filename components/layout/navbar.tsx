import { Button } from "@/components/ui/button";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { MainNav } from "./navbar/main-nav";
import { UserNav } from "./navbar/user-nav";

const Navbar = async () => {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        }
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className={"border-b relative z-50 bg-background"}>
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
              <Button>Vendi</Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export { Navbar };
