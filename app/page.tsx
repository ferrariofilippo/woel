import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  const { 
    data: { session } 
  } = await supabase.auth.getSession();

  if (!session)
    redirect("/sign-in");

  // Fetch latest ads. Define params 

  // const { data } = await supabase
  //   .from("advertisement")
  //   .select(
  //     `id, price, negotiable_price, rating, notes, status,
  //     book:book_id (isbn, title, author, subject, year),
  //     owner:owner_id (user_id, first_name, last_name, email)`
  //   )
  //   .filter("status", "eq", "Available")
  //   .filter("price", "gte", parseFloat(priceGt ?? "0"))
  //   .filter("price", "lte", parseFloat(priceLt ?? "100"))
  //   .filter("book.isbn", "like", isbn ?? "%")
  //   .filter("book.title", "like", title ?? "%")
  //   .filter("book.subject", "like", subject ?? "%")
  //   .or(`year.eq.${parseInt(year ?? "5")}, ${year === null}`);

  return (
    <div>
      Homepage
    </div>
  );
}
