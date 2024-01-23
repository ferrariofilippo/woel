import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { CreateAdForm } from "@/app/create/create-ad-form";
import { redirect } from "next/navigation";

export default async function Create() {
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
    data: { session }
  } = await supabase.auth.getSession();

  if (!session)
    redirect("/sign-in");

  const { data } = await supabase.from('book').select('isbn,title');

  return (
    <CreateAdForm books={data} user_id={session?.user.id ?? ""} />
  );
}
