import { Database } from "./supabase";

// export type AdPreview = {
//   id: number;
//   price: number;
//   book_title: string;
//   book_author: string;
//   cover_url: string;
//   seller_username: string;
// };

export type Advertisement =
  Database["public"]["Tables"]["advertisement"]["Row"];

export type School = Database["public"]["Tables"]["school"]["Row"];
export type Book = Database["public"]["Tables"]["book"]["Row"];
export type AdPreview = Database["public"]["Views"]["v_ad"]["Row"];
export type Specialization =
  Database["public"]["Tables"]["specialization"]["Row"];
export type User = Database["public"]["Views"]["v_user"]["Row"];
export type UserData = Database["public"]["Tables"]["user_data"]["Row"];
