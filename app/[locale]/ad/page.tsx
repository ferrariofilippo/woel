import { AdDetails } from "@/app/[locale]/ad/ad-details";
import { JoinedAd } from "@/types/joined-ad";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Ad({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/sign-in");

  const advertisementId = searchParams?.id ?? 0;
  if (!advertisementId) redirect("/");

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
    .eq("id", advertisementId)
    .limit(1);

  if (!data || !data.length) redirect("/notfound");

  const ad: JoinedAd = data[0] as unknown as JoinedAd;

  return <AdDetails ad={ad} userId={session.user.id} />;
}
