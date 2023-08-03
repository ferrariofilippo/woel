"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { JoinedAd } from "@/types/joined-ad";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { DefaultAvatar } from "./default-avatar";
import Image from "next/image";
import { useState } from "react";

export interface AdvertisementDisplayParams {
  ad: JoinedAd,
  userId: string
}

export function AdvertisementDisplay({ ad, userId }: AdvertisementDisplayParams) {
  const supabase = createClientComponentClient();
  const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(`${ad.owner.user_id}.png`);

  const [isSaved, setIsSaved] = useState(ad.saved_ad.length !== 0);
  const [isInterested, setIsInterested] = useState(ad.interested_in_ad.length !== 0);

  const toggleSave = async () => {
    if (!isSaved) {
      setIsSaved(true);

      await supabase
        .from("saved_ad")
        .insert({ user_id: userId, advertisement_id: ad.id });
    } else {
      setIsSaved(false);

      await supabase
        .from("saved_ad")
        .delete()
        .eq("user_id", userId)
        .eq("advertisement_id", ad.id);
    }
  };

  const toggleInterest = async () => {
    if (!isInterested) {
      setIsInterested(true);

      await supabase
        .from("interested_in_ad")
        .insert({ user_id: userId, advertisement_id: ad.id });
    } else {
      setIsInterested(false);

      await supabase
        .from("interested_in_ad")
        .delete()
        .eq("user_id", userId)
        .eq("advertisement_id", ad.id);
    }
  };

  console.log(ad);

  return (
    <div
      className="xl:w-1/4 lg:w-1/3 sm:w-1/2 w-full flex flex-col sm:px-4 px-0 pb-8"
    >
      <div
        className="flex gap-2"
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={publicUrl} alt={ad.owner.username} />
          <AvatarFallback>
            <DefaultAvatar />
          </AvatarFallback>
        </Avatar>
        <div
          className="my-auto truncate text-ellipsis"
        >
          {`@${ad.owner.username}`}
        </div>
      </div>
      <div
        className="h-64 w-full rounded-lg my-3"
      >
        {ad.advertisement_picture[0]
          ? <Image
            src={ad.advertisement_picture[0].url}
            alt={ad.book.title}
            width={100}
            height={200}
          />
          : <div className="flex items-center justify-center w-full h-full rounded">
            <svg
              className="w-full h-full text-gray-200 dark:text-gray-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18">
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
            </svg>
          </div>
        }
      </div>
      <div>
        <div className="flex justify-between">
          <div
            className="font-semibold text-lg"
          >
            {ad.price} €
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-full w-6 h-6"
              type="button"
              name="toggle save advertisement button"
              onClick={() => toggleSave()}
            >
              {isSaved
                ? <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path clip-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" fill-rule="evenodd"></path>
                </svg>
                : <svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              }
            </button>
            <button
              className="rounded-full w-6 h-6"
              type="button"
              name="toggle interest in ad advertisement button"
              onClick={() => toggleInterest()}
            >
              {isInterested
                ? <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path clip-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" fill-rule="evenodd"></path>
                </svg>
                : <svg aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              }
            </button>
          </div>
        </div>
        <p
          className="text-ellipsis h-6 truncate"
        >
          {ad.book.title}
        </p>
      </div>
    </div>
  );
}
