import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { Advertisement } from "@/types/api";
import { UpsertAdForm } from "@/components/forms/upsert-ad-form";

export default async function Edit({
  searchParams,
}: {
  searchParams?: { id: number };
}) {
  if (!searchParams || !(searchParams?.id))
    redirect("/");

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value;
        },
      },
    }
  );
  const { data: { session } } = await supabase.auth.getSession();

  if (!session)
    redirect("/sign-in");

  const getBooks = async () => {
    const { data } = await supabase.from('book').select('isbn, title');
    return data;
  };

  const { data } = await supabase
    .from('advertisement')
    .select('*')
    .eq('owner_id', session.user.id)
    .eq('id', searchParams.id)
    .limit(1);

  if (!data || !(data[0] as Advertisement))
    redirect("/");

  return (
    <UpsertAdForm
      advertisement={data[0] as Advertisement}
      books={await getBooks()}
      userId={session.user.id}
    />
  );
}
