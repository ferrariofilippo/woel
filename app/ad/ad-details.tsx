"use client"

import { JoinedAd } from "@/types/joined-ad";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui";
import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DefaultAvatar } from "@/components/ui/default-avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import styles from "@/components/styles/caousel.module.css";
import adStyles from "@/components/styles/advertisement.animations.module.css";

interface AdDetailsParams {
  ad: JoinedAd,
  userId: string
}

export function AdDetails({ ad, userId }: AdDetailsParams) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );
  const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(`${ad.owner.user_id}.png`);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
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

  const swapImageToIndex = (index: number) => {
    const image = document.getElementById("active-image");
    image?.classList.add(styles.carouselitem);

    setTimeout(() => {
      setActiveImageIndex(index);
      setTimeout(() => {
        image?.classList.remove(styles.carouselitem);
      }, 800);
    }, 200);
  };

  return (
    <div className="flex md:flex-row flex-col sm:mx-auto mx-0 mt-5 mb-12 min-h-[85vh] gap-x-20 gap-y-8">
      <div className="flex flex-col lg:w-1/2 md:w-2/3 w-full items-center justify-center min-h-full">
        <div
          className="flex gap-2 w-full"
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
          id="images-carousel"
          className="relative w-full my-4"
        >
          <div className="relative h-56 overflow-hidden rounded-lg md:h-96 flex flex-col justify-center">
            {ad.advertisement_picture[activeImageIndex]
              ? <Image
                id="active-image"
                width={1080}
                height={720}
                src={supabase.storage.from("images").getPublicUrl(ad.advertisement_picture[activeImageIndex].url).data.publicUrl}
                className="absolute block w-full"
                alt="..."
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
          <button
            type="button"
            className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            onClick={() => swapImageToIndex(activeImageIndex > 0 ? activeImageIndex - 1 : ad.advertisement_picture.length - 1)}
          >
            <span
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none"
            >
              <svg
                className="w-4 h-4 text-white dark:text-gray-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4" />
              </svg>
              <span
                className="sr-only"
              >
                Previous
              </span>
            </span>
          </button>
          <button
            type="button"
            className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            onClick={() => swapImageToIndex(activeImageIndex < ad.advertisement_picture.length - 1 ? activeImageIndex + 1 : 0)}
          >
            <span
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
              <svg
                className="w-4 h-4 text-white dark:text-gray-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              <span
                className="sr-only"
              >
                Next
              </span>
            </span>
          </button>
        </div>
        <div className="flex justify-between w-full">
          {ad.status === "Available"
            ? <Badge variant="default">Disponibile</Badge>
            : ad.status === "Negotiating"
              ? <Badge variant="secondary">Negoziazione iniziata</Badge>
              : <Badge variant="destructive">Non più disponibile</Badge>
          }
          <div className="flex gap-2">
            <button
              className="rounded-full w-8 h-8"
              type="button"
              name="toggle save advertisement button"
              onClick={toggleSave}
            >
              {isSaved
                ? <svg
                  className={adStyles.hoverpulse}
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                    fillRule="evenodd"
                  ></path>
                </svg>
                : <svg
                  className={adStyles.hovershake}
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              }
            </button>
            <button
              className="rounded-full w-8 h-8"
              type="button"
              name="toggle interest in ad advertisement button"
              onClick={toggleInterest}
            >
              {isInterested
                ? <svg
                  className={adStyles.hoverspin}
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                    fillRule="evenodd"
                  ></path>
                </svg>
                : <svg
                  className={adStyles.hovershake}
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              }
            </button>
          </div>
        </div>
      </div>
      <div className="lg:w-1/2 w-full flex flex-col gap-y-6 min-h-full justify-center">
        <h4 className="font-semibold text-3xl">
          {ad.book.title}
        </h4>
        <span className="font-medium text-2xl">
          € {ad.price < 10
            ? ad.price.toPrecision(3)
            : ad.price.toPrecision(4)
          }
        </span>
        <table className="w-full">
          <tbody>
            <tr>
              <td className="font-semibold">
                ISBN
              </td>
              <td className="tracking-wide">
                {ad.book.isbn}
              </td>
            </tr>
            <tr>
              <td className="font-semibold">
                Autore
              </td>
              <td>
                {ad.book.author}
              </td>
            </tr>
            <tr>
              <td className="font-semibold">
                Materia
              </td>
              <td>
                {ad.book.subject}
              </td>
            </tr>
            <tr>
              <td className="font-semibold">
                Anno
              </td>
              <td>
                {ad.book.year}
              </td>
            </tr>
            <tr>
              <td className="font-semibold">
                Prezzo negoziabile
              </td>
              <td>
                {ad.negotiable_price
                  ? <span>Sì &#x2714;</span>
                  : <span>No &#x2716;</span>
                }
              </td>
            </tr>
            <tr>
              <td className="font-semibold">
                Condizioni
              </td>
              <td>
                {ad.rating === 1
                  ? <span>Pessime &#x1F61F;</span>
                  : ad.rating === 2
                    ? <span>Mediocri &#x1F60C;</span>
                    : ad.rating === 3
                      ? <span>Discrete &#x1F610;</span>
                      : ad.rating === 4
                        ? <span>Buone &#x1F615;</span>
                        : <span>Ottime &#x1F604;</span>
                }
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <span className="font-semibold">
            Note
          </span>
          <ScrollArea className="h-[100px] w-full">
            {ad.notes}
          </ScrollArea>
        </div>
        <Button className="mt-8">
          <a
            className=""
            href={`mailto:${ad.owner.email}`}
          >
            Contatta il venditore
          </a>
        </Button>
      </div>
    </div>
  )
}
