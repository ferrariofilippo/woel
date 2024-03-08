import { WoelAvatar } from "@/components/avatar-woel";
import { ProfilePageContent } from "@/components/user/profile-content";
import { getUserByUsername } from "@/lib/api/user";
import { UserData } from "@/types/api";

export async function generateMetadata({
  params: { username },
}: {
  params: { username: string };
}) {
  return {
    title: username,
  };
}

export default async function UserPage({
  params,
}: {
  params: { username: string };
}) {
  const user: UserData = await getUserByUsername(params.username);
  return (
    <div className="flex flex-col items-center gap-6 m-10">
      <WoelAvatar
        username={user.username!}
        avatar_url={user.avatar_url!}
        height={140}
        width={140}
      />
      <div className="text-center">
        <h2 className="text-2xl font-bold">{user.full_name}</h2>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          @{user.username}
        </p>
      </div>
      {/* Annunci postati dall'utente */}
      <ProfilePageContent username={params.username} />
    </div>
  );
}
