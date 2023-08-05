import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { CreateAdForm } from "@/app/create/create-ad-form";
import { redirect } from "next/navigation";

export default async function Create() {
  const supabase = createServerComponentClient({ cookies });
  const { 
    data: { session } 
  } = await supabase.auth.getSession();

  if (!session)
    redirect("/sign-in");

  const { data } = await supabase.from('book').select('isbn,title');

  return (
    <CreateAdForm books={data} user_id={session?.user.id ?? ""}/>
  );
}
