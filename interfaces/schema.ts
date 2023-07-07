export interface Database {
  public: {
    tables: {
      advertisement: {
        Row: {
          id: number,
          owner_id: string
          book_id: string,
          price: number,
          negotiable_price: boolean,
          rating: number,
          notes: string | null,
          status: string
        }
        Insert: {
          id: number,
          owner_id: string
          book_id: string,
          price: number,
          negotiable_price: boolean,
          rating: number,
          notes: string | null,
          status: string
        }
        Update: {
          id: number,
          owner_id: string
          book_id: string,
          price: number,
          negotiable_price: boolean,
          rating: number,
          notes: string | null,
          status: string
        }
      }
      book: {
        Row: {
          isbn: string,
          title: string,
          author: string,
          subject: string,
          year: number
        }
        Insert: {
          isbn: string,
          title: string,
          author: string,
          subject: string,
          year: number
        }
        Update: {
          isbn: string,
          title: string,
          author: string,
          subject: string,
          year: number  
        }
      }
      advertisement_picture: {
        Row: {
          id: number,
          advertisement_id: number,
        }
        Insert: {
          id: number,
          advertisement_id: number,
        }
        Update: {
          id: number,
          advertisement_id: number,
        }
      }
      interested_in_ad: {
        Row: {
          user_ad: string,
          advertisement_id: number
        }
        Insert: {
          user_ad: string,
          advertisement_id: number
        }
        Update: {
          user_ad: string,
          advertisement_id: number  
        }
      }
      saved_ad: {
        Row: {
          user_ad: string,
          advertisement_id: number
        }
        Insert: {
          user_ad: string,
          advertisement_id: number
        }
        Update: {
          user_ad: string,
          advertisement_id: number          
        }
      }
      school: {
        Row: {
          id: number,
          school_name: string
        }
        Insert: {
          id: number,
          school_name: string
        }
        Update: {
          id: number,
          school_name: string
        }
      }
      specialization: {
        Row: {
          id: number,
          school_id: number,
          specialization_name: string
        }
        Insert: {
          id: number,
          school_id: number,
          specialization_name: string
        }
        Update: {
          id: number,
          school_id: number,
          specialization_name: string    
        }
      }
      user_data: {
        Row: {
          user_id: string,
          first_name: string,
          last_name: string,
          class: string,
          public_contact: string,
          contact_type: number,
          school_id: number,
          specialization_id: number
        }
        Insert: {
          user_id: string,
          first_name: string,
          last_name: string,
          class: string,
          public_contact: string,
          contact_type: number,
          school_id: number,
          specialization_id: number
        }
        Update: {
          user_id: string,
          first_name: string,
          last_name: string,
          class: string,
          public_contact: string,
          contact_type: string,
          school_id: number,
          specialization_id: number 
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      advertisement_status: [
        'Available',
        'Negotiating',
        'Closed'
      ]
      contact_type: [
        'Email',
        'Phone'
      ]
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}