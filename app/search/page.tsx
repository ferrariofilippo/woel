import { LatestAds } from "@/components/home/latest-ads";
import { MainActions } from "@/components/home/main-actions";
import { SearchComponent } from "@/components/ui/search";
import { JoinedAd } from "@/types/joined-ad";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const MIN_PRICE = 0;
const MAX_PRICE = 100;
const DEFAULT_YEAR = 5;
const MATCH_ALL = "%";
const DEFAULT_FETCH_AMOUNT = 10;

export default async function Search() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session)
    redirect("/sign-in");

  const getFilteredData = async (
    year?: number,
    priceGt?: number,
    priceLt?: number,
    isbn?: string,
    title?: string,
    subject?: string
  ) => {
    const { data } = await supabase
      .from("advertisement")
      .select(
        `id, price, negotiable_price, rating, notes, status,
        book:book_id (
          isbn, title, author, subject, year
        ),
        owner:owner_id (
          user_id, first_name, last_name, email
        ),
        advertisement_picture (
          url
        )`
      )
      .filter("status", "eq", "Available")
      .filter("price", "gte", priceGt ?? MIN_PRICE)
      .filter("price", "lte", priceLt ?? MAX_PRICE)
      .filter("book.isbn", "like", isbn ?? MATCH_ALL)
      .filter("book.title", "like", title ?? MATCH_ALL)
      .filter("book.subject", "like", subject ?? MATCH_ALL)
      .or(`year.eq.${year ?? DEFAULT_YEAR}, ${!year}`)
      .order("creation_date", {
        ascending: false
      })
      .limit(DEFAULT_FETCH_AMOUNT);

    return data;
  };

  // const data = await getFilteredData(classYear);

  return (
    <>
    </>
  )
}
