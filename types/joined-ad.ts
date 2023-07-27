import { Database } from "./supabase"

export interface JoinedAd {
  id: number
  negotiable_price: boolean
  notes: string | null
  price: number
  rating: number
  status: Database["public"]["Enums"]["advertisement_status"] | null
  owner: {
    user_id: string,
    first_name: string,
    last_name: string,
    email: string
  }[],
  book: {
    isbn: string,
    title: string,
    author: string,
    subject: string,
    year: number
  }[],
  advertisement_picture: {
    url: string
  }[]
}
