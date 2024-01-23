import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EnvelopeClosedIcon,
  GearIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

import { AvatarWoel } from "@/components/user/avatar-woel";
import { getUserByID } from "@/lib/api/user";
import Link from "next/link";
import SignOutButton from "./sign-out-button";

export async function UserDropdown({ session }: { session: any }) {
  const profile = await getUserByID(session.user?.id!);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <AvatarWoel
            username={profile.username!}
            avatar_url={profile.avatar_url!}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.full_name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {profile?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={"/user/" + profile?.username}>
            <DropdownMenuItem className="gap-2">
              <PersonIcon />
              Profile
            </DropdownMenuItem>
          </Link>
          <Link href="/inbox">
            <DropdownMenuItem className="gap-2">
              <EnvelopeClosedIcon />
              Inbox
            </DropdownMenuItem>
          </Link>
          <Link href="/account">
            <DropdownMenuItem className="gap-2">
              <GearIcon />
              Account
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
