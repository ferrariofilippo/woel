import {
  User,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { SUPABASE_URL } from "../costants";

export async function getServerSession() {
  const supabase = createServerComponentClient({ cookies });
  return await supabase.auth.getSession();
}
export async function getSessionUserInfo(id: string) {
  const userData = await fetch(SUPABASE_URL + "/api/user?id=" + id);
  if (!userData.ok) {
    throw new Error("Failed to fetch data");
  }
  return userData.json();
}
export async function getSessionUser(): Promise<User> {
  const session: any = await getServerSession();
  return session.data.session.user;
}
