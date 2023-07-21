import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

export const SOLD_STATE = 3;

export const database = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_KEY ?? ""
);

export type User = Database["public"]["Tables"]["user_data"]["Update"];

export type Advertisement =
  Database["public"]["Tables"]["advertisement"]["Row"];

export const fetchUserById = async (userId: string) => {
  try {
    const { data } = await database
      .from("user_data")
      .select(
        `user_id, first_name, last_name, class, email,
        specialization:specialization_id (specialization_name),
        school:school_id (school_name)`
      )
      .eq("user_id", userId);

    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const setUserPicture = async (
  userId: string,
  file: ReadableStream<Uint8Array>
) => {
  try {
    const { error } = await database.storage
      .from("avatars")
      .upload(`${userId}.png`, file, {
        cacheControl: "3600",
        upsert: true,
      });

    return error;
  } catch (error) {
    console.log("error", error);
  }
};

export const fetchAdById = async (advertisementId: number) => {
  try {
    const { data } = await database
      .from("advertisement")
      .select(
        `id, price, negotiable_price, rating, notes, status,
        book:book_id (isbn, title, author, subject, year),
        owner:owner_id (user_id, first_name, last_name, email)`
      )
      .eq("id", advertisementId);

    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const markAsSold = async (advertisementId: number) => {
  try {
    const { error } = await database
      .from("advertisement")
      .update({ status: SOLD_STATE })
      .eq("id", advertisementId);

    return error;
  } catch (error) {
    console.log("error", error);
  }
};

export const saveAd = async (advertisementId: number, userId: string) => {
  try {
    const { error } = await database
      .from("saved_ad")
      .insert({ user_id: userId, advertisement_id: advertisementId });

    return error;
  } catch (error) {
    console.log("error", error);
  }
};

export const markAsInterested = async (
  advertisementId: number,
  userId: string
) => {
  try {
    const { error } = await database
      .from("interested_in_ad")
      .insert({ user_id: userId, advertisement_id: advertisementId });

    return error;
  } catch (error) {
    console.log("error", error);
  }
};
