import { LatestAds } from "@/components/home/latest-ads";
import { MainActions } from "@/components/home/main-actions";
import { SearchComponent } from "@/components/ui/search";
import { JoinedAd } from "@/types/joined-ad";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const DEFAULT_YEAR = 5;
const DEFAULT_FETCH_AMOUNT = 10;

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session)
    redirect("/sign-in");

  const getClassIfAvailable = async () => {
    const { data } = await supabase
      .from("user_data")
      .select("class")
      .eq("user_id", session.user.id)
      .single();

    if (!data)
      return undefined;

    const year = data["class"].toString().charAt(0);

    return year && year > '0' && year < '6'
      ? parseInt(year)
      : undefined;
  };

  const getLatestData = async (year?: number) => {
    const { data } = await supabase
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
      .not("book", "is", null)
      .filter("book.year", "eq", year ?? DEFAULT_YEAR)
      .order("creation_date", {
        ascending: false
      })
      .limit(DEFAULT_FETCH_AMOUNT);

    const ads = Array<JoinedAd>();
    
    data?.forEach(ad => ads.push(ad as unknown as JoinedAd));

    return ads;
  };

  const classYear = await getClassIfAvailable();

  const latest = await getLatestData(classYear);

  return (
    <div
      className="flex flex-col mt-5 gap-8 mb-12"
    >
      <SearchComponent />
      <MainActions />
      <LatestAds ads={latest} userId={session.user.id} />
    </div>
  );
}
