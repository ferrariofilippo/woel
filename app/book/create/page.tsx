import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { CreateBookForm } from "./create-book-form";
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

  return (
    <CreateBookForm />
  );
}
