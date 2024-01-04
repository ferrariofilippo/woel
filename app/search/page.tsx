"use client"

import { JoinedAd } from "@/types/joined-ad";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const FiltersSection = dynamic(() => import("@/app/search/filters-section").then((mod) => mod.FiltersSection), { ssr: false });
const AdvertisementDisplay = dynamic(() => import("@/components/ui/advertisement-display").then((mod) => mod.AdvertisementDisplay), { ssr: false });

const DEFAULT_FETCH_AMOUNT = 10;

export default function Search({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );
  const [ads, setAds] = useState(Array<JoinedAd>());
  const [userId, setUserId] = useState("");

  const skeletons = [0, 1, 2, 3];

  var query = searchParams?.q ?? "";
  if (typeof query === typeof [""])
    query = query[0];

  useEffect(() => {
    supabase.auth
      .getSession()
      .then((data) => {
        if (!data.data.session)
          router.push("sign-in");
        else
          setUserId(data.data.session.user.id);

        supabase
          .from("advertisement")
          .select(
            `id, price, negotiable_price, rating, notes, status,
          book:book_id (
            isbn, title, author, subject, year
          ),
          owner:owner_id (
            id, full_name, username, email
          ),
          advertisement_picture (
            url
          ),
          saved_ad (
            advertisement_id
          ),
          interested_in_ad (
            advertisement_id
          )`
          )
          .filter("status", "eq", "Available")
          .neq("owner_id", data.data.session?.user.id ?? "")
          .not("book", "is", null)
          .filter("price", "lte", 50.0)
          .or(`isbn.like.%${query}%,title.ilike.%${query}%`, { foreignTable: "book" })
          .order("creation_date", {
            ascending: false
          })
          .limit(DEFAULT_FETCH_AMOUNT)
          .then((data) => {
            const ads = Array<JoinedAd>();
            data.data?.forEach(ad => ads.push(ad as unknown as JoinedAd));

            setAds(ads);
          });
      });
  }, [query, router, supabase]);

  return (
    <div className="mt-5 mb-12">
      <FiltersSection
        setData={setAds}
        supabase={supabase}
        userId={userId}
      />
      <div className="mt-[calc(32px+1rem)]">
        <h4 className="font-semibold text-xl ms-1">
          Ecco i risultati della tua ricerca
        </h4>
        <div className="flex sm:flex-row flex-col flex-wrap mt-5">
          {ads && ads.length
            ? ads.map((ad) =>
              <AdvertisementDisplay
                userId={userId}
                ad={ad}
                key={ad.id}
              />
            )
            : skeletons.map((s) =>
              <div
                key={s}
                role="status"
                className="animate-pulse xl:w-1/4 lg:w-1/3 sm:w-1/2 w-full flex flex-col sm:px-4 px-0 pb-8"
              >
                <div className="flex items-center mt-4 space-x-3">
                  <svg className="w-10 h-10 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                  </svg>
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                </div>
                <div className="flex items-center justify-center h-48 my-3 bg-gray-300 rounded dark:bg-gray-700">
                  <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                    <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                  </svg>
                </div>
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <span className="sr-only">Loading...</span>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
