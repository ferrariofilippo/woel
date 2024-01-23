import { Advertisement, UserData } from "@/types/api";
import { createClient } from "@supabase/supabase-js";

export const SOLD_STATE = 3;

export const database = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export const fetchUserById = async (id: string) => {
  try {
    const { data } = await database
      .from("user_data")
      .select(`*`)
      .eq("id", id)
      .limit(1)
      .single();
    return data;
  } catch (error) {
    console.log("error", error);
    return error;
  }
};
export const fetchUserByUsername = async (username: string) => {
  try {
    const { data } = await database
      .from("user_data")
      .select(`*`)
      .eq("username", username)
      .limit(1)
      .single();
    return data;
  } catch (error) {
    console.log("error", error);
    return error;
  }
};
export const fetchSchools = async () => {
  try {
    let { data, error } = await database.from("school").select("*");
    return data;
  } catch (error) {
    console.log("error", error);
    return error;
  }
};
export const fetchSchoolSpecializations = async (school_id: number) => {
  try {
    let { data, error } = await database
      .from("specialization")
      .select("*")
      .eq("school_id", school_id);
    return data;
  } catch (error) {
    console.log("error", error);
    return error;
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

export const updateUser = async (user: UserData) => {
  try {
    const { error } = await database
      .from("user_data")
      .update({
        full_name: user.full_name,
        class: user.class,
        school_id: user.school_id,
        specialization_id: user.specialization_id,
      })
      .eq("user_id", user.id);

    return error;
  } catch (error) {
    console.log("error", error);
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const { error } = await database
      .from("user_data")
      .delete()
      .eq("user_id", userId);

    return error;
  } catch (error) {
    console.log("error", error);
  }
};

export const fetchAds = async (
  priceGt: string | null,
  priceLt: string | null,
  isbn: string | null,
  title: string | null,
  subject: string | null,
  year: string | null
) => {
  try {
    const { data } = await database
      .from("advertisement")
      .select(
        `id, price, negotiable_price, rating, notes, status,
        book:book_id (isbn, title, author, subject, year),
        owner:owner_id (user_id, first_name, last_name, email)`
      )
      .filter("status", "eq", "Available")
      .filter("price", "gte", parseFloat(priceGt ?? "0"))
      .filter("price", "lte", parseFloat(priceLt ?? "100"))
      .filter("book.isbn", "like", isbn ?? "%")
      .filter("book.title", "like", title ?? "%")
      .filter("book.subject", "like", subject ?? "%")
      .or(`year.eq.${parseInt(year ?? "5")}, ${year === null}`);

    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const fetchAdById = async (advertisementId: string) => {
  try {
    const { data } = await database
      .from("advertisement")
      .select(
        `id, price, negotiable_price, rating, notes,status, book (isbn, title, author, subject, year),
        user_data (id,username,full_name, email)`
      )
      .eq("id", advertisementId);

    return data;
  } catch (error) {
    console.log("error", error);
  }
};

export const fetchAdByUserName = async (username: string) => {
  try {
    const { data } = await database.from("advertisement").select(
      `id, price, negotiable_price, rating, notes,status, book (isbn, title, author, subject, year),
        user_data (id,username,full_name, email)`
    );
    return data?.filter((data: any) => data.user_data.username === username);
  } catch (error) {
    console.log("error", error);
  }
};
export const createAd = async (ad: Advertisement) => {
  try {
    await database.from("advertisement").insert(ad);
  } catch (error) {
    console.log("error", error);
  }
};

export const updateAd = async (ad: Advertisement) => {
  try {
    const { error } = await database
      .from("advertisement")
      .update({
        owner_id: ad.owner_id,
        book_id: ad.book_id,
        price: ad.price,
        negotiable_price: ad.negotiable_price,
        rating: ad.rating,
        notes: ad.notes,
        status: ad.status,
      })
      .eq("id", ad.id);

    return error;
  } catch (error) {
    console.log("error", error);
  }
};

export const addAdPicture = async (
  advertisementId: number,
  file: ReadableStream<Uint8Array>
) => {
  try {
    const { data } = await database
      .from("advertisement_picture")
      .insert({ id: 0, advertisement_id: advertisementId })
      .select();

    if (data !== null) {
      await database.storage
        .from("avatars")
        .upload(`${advertisementId}_${data[0]["id"]}.png`, file, {
          cacheControl: "3600",
          upsert: true,
        });
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const removeAdPicture = async (
  advertisementId: number,
  pictureId: number
) => {
  try {
    const { error } = await database
      .from("advertisement_picture")
      .delete()
      .match({
        advertisement_id: advertisementId,
        id: pictureId,
      });

    await database.storage
      .from("images")
      .remove([`${advertisementId}_${pictureId}.png`]);

    return error;
  } catch (error) {
    console.log(error);
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

export const deleteAd = async (advertisementId: number) => {
  try {
    const { data } = await database
      .from("advertisement_picture")
      .select()
      .eq("advertisement_id", advertisementId);

    data?.forEach(async (entry) => {
      await removeAdPicture(advertisementId, entry["id"]);
    });

    const { error } = await database
      .from("advertisement")
      .delete()
      .eq("id", advertisementId);

    return error;
  } catch (error) {
    console.log("error", error);
  }
};
export const getUserAdsPrev = async (userName: string) => {
  try {
    let { data: ad_preview, error } = await database
      .from("v_ad")
      .select("*")
      .eq("seller_username", userName);
    return ad_preview;
  } catch (error) {
    console.log("error", error);
  }
};
