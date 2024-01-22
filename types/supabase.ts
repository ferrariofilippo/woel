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
          creation_date: string
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
          creation_date?: string
          id?: number
          negotiable_price: boolean
          notes?: string | null
          owner_id: string
          price: number
          rating: number
          status?: Database["public"]["Enums"]["advertisement_status"] | null
        }
        Update: {
          book_id?: string
          creation_date?: string
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
            isOneToOne: false
            referencedRelation: "book"
            referencedColumns: ["isbn"]
          },
          {
            foreignKeyName: "advertisement_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "user_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertisement_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "v_user"
            referencedColumns: ["id"]
          }
        ]
      }
      advertisement_picture: {
        Row: {
          advertisement_id: number
          id: number
          isCover: boolean
          url: string
        }
        Insert: {
          advertisement_id: number
          id?: number
          isCover?: boolean
          url: string
        }
        Update: {
          advertisement_id?: number
          id?: number
          isCover?: boolean
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "advertisement_picture_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "advertisement"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "advertisement_picture_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "v_ad"
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
            isOneToOne: false
            referencedRelation: "advertisement"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interested_in_ad_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "v_ad"
            referencedColumns: ["id"]
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
            isOneToOne: false
            referencedRelation: "advertisement"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_ad_advertisement_id_fkey"
            columns: ["advertisement_id"]
            isOneToOne: false
            referencedRelation: "v_ad"
            referencedColumns: ["id"]
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
            isOneToOne: false
            referencedRelation: "school"
            referencedColumns: ["id"]
          }
        ]
      }
      subject: {
        Row: {
          description: string | null
          subject_id: string
          subject_name: string
        }
        Insert: {
          description?: string | null
          subject_id?: string
          subject_name: string
        }
        Update: {
          description?: string | null
          subject_id?: string
          subject_name?: string
        }
        Relationships: []
      }
      user_data: {
        Row: {
          avatar_url: string | null
          class: string | null
          email: string | null
          full_name: string | null
          id: string
          school_id: number | null
          specialization_id: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          class?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          school_id?: number | null
          specialization_id?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          class?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          school_id?: number | null
          specialization_id?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_data_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_data_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "school"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_data_specialization_id_fkey"
            columns: ["specialization_id"]
            isOneToOne: false
            referencedRelation: "specialization"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      v_ad: {
        Row: {
          book_author: string | null
          book_title: string | null
          cover_url: string | null
          id: number | null
          price: number | null
          seller_username: string | null
        }
        Relationships: []
      }
      v_user: {
        Row: {
          avatar_url: string | null
          class: string | null
          email: string | null
          full_name: string | null
          id: string | null
          school: string | null
          specialization: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_data_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
