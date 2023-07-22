import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { CreateBookForm } from "./create-book-form";
import { redirect } from "next/navigation";

export default async function Create() {
  const supabase = createServerComponentClient({ cookies });
  const { 
    data: { session } 
  } = await supabase.auth.getSession();

  if (!session)
    redirect("/sign-in");

  return (
    <CreateBookForm />
  );
}
