import { Button } from "../ui";
import { MainNav } from "./navbar/main-nav";
import { UserDropdown } from "./navbar/user-dropdwn";

export async function Navbar({ session }: { session: any }) {
  return (
    <div className="border-b w-full px-7 relative bg-background z-50">
      <div className="flex h-16 items-center justify-between">
        <div className="flex flex-row justify-center items-center gap-10">
          <MainNav />
        </div>
        {session ? (
          <UserDropdown session={session} />
        ) : (
          <div className="ml-auto flex items-center space-x-4 w-fit">
            <a href="/sign-in">
              <Button variant="ghost">Login</Button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
