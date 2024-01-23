import { SUPABASE_URL } from "../costants";

export const BASE_URL = process.env.NEXT_PUBLIC_APP_DOMAIN;
export const getUserByID = async (id: string) => {
  const res = await fetch(BASE_URL + "/api/user?id=" + id);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};
export const getUserByUsername = async (username: string) => {
  const REVALIDATE_TIME = 120;
  const res = await fetch(BASE_URL + "/api/user/" + username, {
    next: { revalidate: REVALIDATE_TIME },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
export const postAvatar = async (
  filename: string,
  supabase: any,
  file: string
) => {
  const { data, error } = await supabase.storage
    .from("avatars")
    .upload(filename, file, {
      cacheControl: "3600",
      upsert: false,
    });
  return { data, error };
};
export const getAvatarURL = async (supabase: any, profileId: string) => {
  let { data, error } = await supabase
    .from("user_data")
    .select("avatar_url")
    .eq("id", profileId)
    .single();
  return { data, error };
};

export const setNewUserAvatar = async (
  supabase: any,
  filepath: string,
  profileId: string
) => {
  let { data, error } = await supabase
    .from("user_data")
    .update({
      avatar_url: `${SUPABASE_URL}/storage/v1/object/public/avatars/${filepath}`,
    })
    .eq("id", profileId);
  return { data, error };
};
