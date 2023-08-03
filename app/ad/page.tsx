import { LatestAds } from "@/components/home/latest-ads";
import { MainActions } from "@/components/home/main-actions";
import { SearchComponent } from "@/components/ui/search";
import { JoinedAd } from "@/types/joined-ad";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Ad({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session)
    redirect("/sign-in");

  const advertisementId = searchParams?.id ?? 0;
  if (!advertisementId)
    redirect("/");

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
      )`
    )
    .eq("id", advertisementId)
    .limit(1);

  if (!data || !data.length)
    redirect("/notfound");

  const ad = data[0] as unknown as JoinedAd;

  return (
    <>
    </>
  )
}
