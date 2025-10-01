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
      families: {
        Row: {
          id: string
          name: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      loved_ones: {
        Row: {
          id: string
          family_id: string
          name: string
          birth_date: string | null
          interests: string[] | null
          hobbies: string[] | null
          clothing_size: string | null
          shoe_size: string | null
          favorite_colors: string[] | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          family_id: string
          name: string
          birth_date?: string | null
          interests?: string[] | null
          hobbies?: string[] | null
          clothing_size?: string | null
          shoe_size?: string | null
          favorite_colors?: string[] | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          name?: string
          birth_date?: string | null
          interests?: string[] | null
          hobbies?: string[] | null
          clothing_size?: string | null
          shoe_size?: string | null
          favorite_colors?: string[] | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          family_id: string
          name: string
          date: string
          budget_limit: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          family_id: string
          name: string
          date: string
          budget_limit?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          name?: string
          date?: string
          budget_limit?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      gifts: {
        Row: {
          id: string
          loved_one_id: string
          event_id: string | null
          name: string
          description: string | null
          price: number | null
          purchased: boolean
          purchase_date: string | null
          store: string | null
          url: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          loved_one_id: string
          event_id?: string | null
          name: string
          description?: string | null
          price?: number | null
          purchased?: boolean
          purchase_date?: string | null
          store?: string | null
          url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          loved_one_id?: string
          event_id?: string | null
          name?: string
          description?: string | null
          price?: number | null
          purchased?: boolean
          purchase_date?: string | null
          store?: string | null
          url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      person_budget_limits: {
        Row: {
          id: string
          loved_one_id: string
          event_id: string | null
          budget_limit: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          loved_one_id: string
          event_id?: string | null
          budget_limit: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          loved_one_id?: string
          event_id?: string | null
          budget_limit?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
