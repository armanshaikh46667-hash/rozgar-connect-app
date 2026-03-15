export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_date: string
          booking_time: string
          created_at: string
          customer_mobile: string
          customer_name: string
          description: string | null
          id: string
          status: string
          worker_category: string
          worker_mobile: string
          worker_name: string
        }
        Insert: {
          booking_date: string
          booking_time: string
          created_at?: string
          customer_mobile: string
          customer_name: string
          description?: string | null
          id?: string
          status?: string
          worker_category: string
          worker_mobile: string
          worker_name: string
        }
        Update: {
          booking_date?: string
          booking_time?: string
          created_at?: string
          customer_mobile?: string
          customer_name?: string
          description?: string | null
          id?: string
          status?: string
          worker_category?: string
          worker_mobile?: string
          worker_name?: string
        }
        Relationships: []
      }
      digital_services: {
        Row: {
          address: string | null
          created_at: string
          description: string | null
          id: string
          mobile: string
          owner_name: string
          photo: string | null
          service_type: string
          shop_name: string
          village: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          description?: string | null
          id?: string
          mobile: string
          owner_name: string
          photo?: string | null
          service_type: string
          shop_name: string
          village: string
        }
        Update: {
          address?: string | null
          created_at?: string
          description?: string | null
          id?: string
          mobile?: string
          owner_name?: string
          photo?: string | null
          service_type?: string
          shop_name?: string
          village?: string
        }
        Relationships: []
      }
      education_coaching: {
        Row: {
          address: string | null
          course_type: string
          created_at: string
          description: string | null
          fees: string | null
          id: string
          institute_name: string
          mobile: string
          owner_name: string
          photo: string | null
          timing: string | null
          village: string
        }
        Insert: {
          address?: string | null
          course_type: string
          created_at?: string
          description?: string | null
          fees?: string | null
          id?: string
          institute_name: string
          mobile: string
          owner_name: string
          photo?: string | null
          timing?: string | null
          village: string
        }
        Update: {
          address?: string | null
          course_type?: string
          created_at?: string
          description?: string | null
          fees?: string | null
          id?: string
          institute_name?: string
          mobile?: string
          owner_name?: string
          photo?: string | null
          timing?: string | null
          village?: string
        }
        Relationships: []
      }
      local_businesses: {
        Row: {
          address: string | null
          category: string
          created_at: string
          description: string | null
          id: string
          lat: number | null
          lng: number | null
          mobile: string
          name: string
          photo: string | null
          village: string
        }
        Insert: {
          address?: string | null
          category: string
          created_at?: string
          description?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          mobile: string
          name: string
          photo?: string | null
          village: string
        }
        Update: {
          address?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          mobile?: string
          name?: string
          photo?: string | null
          village?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          recipient_mobile: string
          related_booking_id: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          recipient_mobile: string
          related_booking_id?: string | null
          title: string
          type?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          recipient_mobile?: string
          related_booking_id?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_booking_id_fkey"
            columns: ["related_booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      pin_reset_otps: {
        Row: {
          created_at: string
          id: string
          mobile: string
          otp: string
          used: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          mobile: string
          otp: string
          used?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          mobile?: string
          otp?: string
          used?: boolean
        }
        Relationships: []
      }
      workers: {
        Row: {
          about: string
          availability: string
          category: string
          created_at: string
          experience: number
          gallery: string[] | null
          id: string
          lat: number | null
          lng: number | null
          mobile: string
          name: string
          photo: string | null
          pin: string
          price_max: number | null
          price_min: number | null
          ratings: Json | null
          reviews: Json | null
          service_charge: string | null
          status: string
          village: string
        }
        Insert: {
          about?: string
          availability?: string
          category: string
          created_at?: string
          experience?: number
          gallery?: string[] | null
          id?: string
          lat?: number | null
          lng?: number | null
          mobile: string
          name: string
          photo?: string | null
          pin: string
          price_max?: number | null
          price_min?: number | null
          ratings?: Json | null
          reviews?: Json | null
          service_charge?: string | null
          status?: string
          village: string
        }
        Update: {
          about?: string
          availability?: string
          category?: string
          created_at?: string
          experience?: number
          gallery?: string[] | null
          id?: string
          lat?: number | null
          lng?: number | null
          mobile?: string
          name?: string
          photo?: string | null
          pin?: string
          price_max?: number | null
          price_min?: number | null
          ratings?: Json | null
          reviews?: Json | null
          service_charge?: string | null
          status?: string
          village?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
