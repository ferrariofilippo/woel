"use client"

import { JoinedAd } from "@/types/joined-ad";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { FiltersSection } from "./filters-section";
import { AdvertisementDisplay } from "@/components/ui/advertisement-display";
import { useEffect, useState } from "react";

const DEFAULT_FETCH_AMOUNT = 10;

export default function Search({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [ads, setAds] = useState(Array<JoinedAd>());
  const [userId, setUserId] = useState("");

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
      });

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
      })
  }, []);

  return (
    <div className="mt-5 mb-12">
      <FiltersSection
        setData={setAds}
        supabase={supabase}
      />
      <div className="mt-[calc(32px+1rem)]">
        <h4 className="font-semibold text-xl ms-1">
          Ecco i risultati della tua ricerca
        </h4>
        <div className="flex sm:flex-row flex-col flex-wrap mt-5">
          {ads?.map((ad) =>
            <AdvertisementDisplay
              userId={userId}
              ad={ad}
              key={ad.id}
            />
          )}
        </div>
      </div>
    </div>
  )
}
