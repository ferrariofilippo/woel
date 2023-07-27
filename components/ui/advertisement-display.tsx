import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { JoinedAd } from "@/types/joined-ad";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { DefaultAvatar } from "./default-avatar";

export interface AdvertisementDisplayParams {
  ad: JoinedAd
}

export function AdvertisementDisplay({ ad }: AdvertisementDisplayParams) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(`${ad.owner[0].user_id}.png`);

  return (
    <div
      className="flex flex-col"
    >
      <div
        className="flex"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={publicUrl} alt={`@${ad.owner[0].first_name}${ad.owner[0].last_name}`} />
          <AvatarFallback>
            <DefaultAvatar />
          </AvatarFallback>
        </Avatar>
        <div>
          {`${ad.owner[0].first_name} ${ad.owner[0].last_name}`}
        </div>
      </div>
      <div>

      </div>
      <div>
        <div
          className="font-semibold"
        >
          {ad.price} €
        </div>
        <div>
          {ad.book[0].title}
        </div>
      </div>
    </div>
  );
}
