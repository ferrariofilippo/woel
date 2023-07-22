export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      advertisement: {
        Row: {
          book_id: string
          id: number
          negotiable_price: boolean
          notes: string | null
          owner_id: string
          price: number
          rating: number
          status: Database["public"]["Enums"]["advertisement_status"] | null
        }
        Insert: {
          book_id: string
          id?: number
          negotiable_price: any
          notes: string
          owner_id: string
          price: number
          rating: number
          status?: Database["public"]["Enums"]["advertisement_status"] | null
        }
        Update: {
          book_id?: string
          id?: number
          negotiable_price?: boolean
          notes?: string | null
          owner_id?: string
          price?: number
          rating?: number
          status?: Database["public"]["Enums"]["advertisement_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "advertisement_book_id_fkey"
            columns: ["book_id"]
            referencedRelation: "book"
            referencedColumns: ["isbn"]
          },
          {
            foreignKeyName: "advertisement_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "user_data"
            referencedColumns: ["user_id"]
          }
        ]
      }
      advertisement_picture: {
        Row: {
          advertisement_id: number
          id: number
          url: string
        }
        Insert: {
          advertisement_id: number
          id?: number
          url: string
        }
        Update: {
          advertisement_id?: number
          id?: number
          url: string
        }
        Relationships: [
          {
            foreignKeyName: "advertisement_picture_advertisement_id_fkey"
            columns: ["advertisement_id"]
            referencedRelation: "advertisement"
            referencedColumns: ["id"]
          }
        ]
      }
      book: {
        Row: {
          author: string
          isbn: string
          subject: string
          title: string
          year: number
        }
        Insert: {
          author: string
          isbn: string
          subject: string
          title: string
          year: number
        }
        Update: {
          author?: string
          isbn?: string
          subject?: string
          title?: string
          year?: number
        }
        Relationships: []
      }
      interested_in_ad: {
        Row: {
          advertisement_id: number
          user_id: string
        }
        Insert: {
          advertisement_id: number
          user_id: string
        }
        Update: {
          advertisement_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interested_in_ad_advertisement_id_fkey"
            columns: ["advertisement_id"]
            referencedRelation: "advertisement"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interested_in_ad_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_data"
            referencedColumns: ["user_id"]
          }
        ]
      }
      saved_ad: {
        Row: {
          advertisement_id: number
          user_id: string
        }
        Insert: {
          advertisement_id: number
          user_id: string
        }
        Update: {
          advertisement_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_ad_advertisement_id_fkey"
            columns: ["advertisement_id"]
            referencedRelation: "advertisement"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_ad_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "user_data"
            referencedColumns: ["user_id"]
          }
        ]
      }
      school: {
        Row: {
          id: number
          school_name: string
        }
        Insert: {
          id?: number
          school_name: string
        }
        Update: {
          id?: number
          school_name?: string
        }
        Relationships: []
      }
      specialization: {
        Row: {
          id: number
          school_id: number
          specialization_name: string
        }
        Insert: {
          id?: number
          school_id: number
          specialization_name: string
        }
        Update: {
          id?: number
          school_id?: number
          specialization_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "specialization_school_id_fkey"
            columns: ["school_id"]
            referencedRelation: "school"
            referencedColumns: ["id"]
          }
        ]
      }
      user_data: {
        Row: {
          class: string
          email: string
          first_name: string
          last_name: string
          school_id: number | null
          specialization_id: number | null
          user_id: string
        }
        Insert: {
          class: string
          email: string
          first_name: string
          last_name: string
          school_id?: number | null
          specialization_id?: number | null
          user_id: string
        }
        Update: {
          class?: string
          email?: string
          first_name?: string
          last_name?: string
          school_id?: number | null
          specialization_id?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_data_school_id_fkey"
            columns: ["school_id"]
            referencedRelation: "school"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_data_specialization_id_fkey"
            columns: ["specialization_id"]
            referencedRelation: "specialization"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_data_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      advertisement_status: "Available" | "Negotiating" | "Closed"
      contact_type: "Email" | "Phone"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
