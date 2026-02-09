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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      availability_rules: {
        Row: {
          created_at: string
          day_of_week: number | null
          duration_minutes: number
          end_time: string
          id: string
          is_active: boolean
          max_days_in_future: number
          min_hours_before_booking: number
          professional_id: string
          recurrence_type: string
          service_id: string | null
          specific_date: string | null
          start_time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week?: number | null
          duration_minutes?: number
          end_time: string
          id?: string
          is_active?: boolean
          max_days_in_future?: number
          min_hours_before_booking?: number
          professional_id: string
          recurrence_type: string
          service_id?: string | null
          specific_date?: string | null
          start_time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number | null
          duration_minutes?: number
          end_time?: string
          id?: string
          is_active?: boolean
          max_days_in_future?: number
          min_hours_before_booking?: number
          professional_id?: string
          recurrence_type?: string
          service_id?: string | null
          specific_date?: string | null
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_rules_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_rules_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          coupon_id: string | null
          created_at: string
          customer_comments: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          date_time_end: string
          date_time_start: string
          discount_amount: number | null
          feedback_email_sent: boolean | null
          final_price: number | null
          id: string
          mercado_pago_payment_id: string | null
          mercado_pago_preference_id: string | null
          original_price: number | null
          professional_id: string
          service_id: string
          session_code_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          coupon_id?: string | null
          created_at?: string
          customer_comments?: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          date_time_end: string
          date_time_start: string
          discount_amount?: number | null
          feedback_email_sent?: boolean | null
          final_price?: number | null
          id?: string
          mercado_pago_payment_id?: string | null
          mercado_pago_preference_id?: string | null
          original_price?: number | null
          professional_id: string
          service_id: string
          session_code_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          coupon_id?: string | null
          created_at?: string
          customer_comments?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          date_time_end?: string
          date_time_start?: string
          discount_amount?: number | null
          feedback_email_sent?: boolean | null
          final_price?: number | null
          id?: string
          mercado_pago_payment_id?: string | null
          mercado_pago_preference_id?: string | null
          original_price?: number | null
          professional_id?: string
          service_id?: string
          session_code_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "discount_coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_session_code_id_fkey"
            columns: ["session_code_id"]
            isOneToOne: false
            referencedRelation: "session_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          address: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_default: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      capacity_overrides: {
        Row: {
          created_at: string
          date: string
          id: string
          max_capacity: number
          professional_id: string
          service_id: string
          start_time: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          max_capacity: number
          professional_id: string
          service_id: string
          start_time: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          max_capacity?: number
          professional_id?: string
          service_id?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "capacity_overrides_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "capacity_overrides_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_coupons: {
        Row: {
          applicable_package_ids: string[] | null
          code: string
          created_at: string | null
          current_uses: number | null
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean | null
          max_uses: number | null
          min_purchase_amount: number | null
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          applicable_package_ids?: string[] | null
          code: string
          created_at?: string | null
          current_uses?: number | null
          discount_type: string
          discount_value: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_purchase_amount?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          applicable_package_ids?: string[] | null
          code?: string
          created_at?: string | null
          current_uses?: number | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_purchase_amount?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      email_subscribers: {
        Row: {
          created_at: string | null
          email: string
          groups: string[] | null
          id: string
          mailerlite_response: Json | null
          mailerlite_synced: boolean | null
          source: string | null
          tags: string[] | null
          updated_at: string | null
          whatsapp: string
        }
        Insert: {
          created_at?: string | null
          email: string
          groups?: string[] | null
          id?: string
          mailerlite_response?: Json | null
          mailerlite_synced?: boolean | null
          source?: string | null
          tags?: string[] | null
          updated_at?: string | null
          whatsapp: string
        }
        Update: {
          created_at?: string | null
          email?: string
          groups?: string[] | null
          id?: string
          mailerlite_response?: Json | null
          mailerlite_synced?: boolean | null
          source?: string | null
          tags?: string[] | null
          updated_at?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      generated_slots: {
        Row: {
          confirmed_bookings: number
          created_at: string
          date_time_end: string
          date_time_start: string
          id: string
          is_active: boolean
          max_capacity: number
          professional_id: string
          service_id: string
          updated_at: string
        }
        Insert: {
          confirmed_bookings?: number
          created_at?: string
          date_time_end: string
          date_time_start: string
          id?: string
          is_active?: boolean
          max_capacity: number
          professional_id: string
          service_id: string
          updated_at?: string
        }
        Update: {
          confirmed_bookings?: number
          created_at?: string
          date_time_end?: string
          date_time_start?: string
          id?: string
          is_active?: boolean
          max_capacity?: number
          professional_id?: string
          service_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_slots_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_slots_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations_mailerlite: {
        Row: {
          created_at: string
          currency: string
          id: string
          is_active: boolean
          mailerlite_account_id: string | null
          mailerlite_shop_id: string | null
          shop_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          mailerlite_account_id?: string | null
          mailerlite_shop_id?: string | null
          shop_name?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          is_active?: boolean
          mailerlite_account_id?: string | null
          mailerlite_shop_id?: string | null
          shop_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders_sync_log: {
        Row: {
          created_at: string
          error_message: string | null
          http_status: number | null
          id: string
          order_id: string
          order_type: string
          request_body: Json | null
          response_body: Json | null
          status: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          http_status?: number | null
          id?: string
          order_id: string
          order_type?: string
          request_body?: Json | null
          response_body?: Json | null
          status?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          http_status?: number | null
          id?: string
          order_id?: string
          order_type?: string
          request_body?: Json | null
          response_body?: Json | null
          status?: string
        }
        Relationships: []
      }
      package_orders: {
        Row: {
          abandonment_email_sent_at: string | null
          buyer_email: string
          buyer_name: string
          buyer_phone: string | null
          coupon_code: string | null
          coupon_id: string | null
          created_at: string
          discount_amount: number
          error_message: string | null
          final_price: number
          id: string
          is_giftcard: boolean
          mercado_pago_payment_id: string | null
          mercado_pago_preference_id: string | null
          mercado_pago_status: string | null
          mercado_pago_status_detail: string | null
          order_type: string
          original_price: number
          package_id: string
          status: string
          updated_at: string
        }
        Insert: {
          abandonment_email_sent_at?: string | null
          buyer_email: string
          buyer_name: string
          buyer_phone?: string | null
          coupon_code?: string | null
          coupon_id?: string | null
          created_at?: string
          discount_amount?: number
          error_message?: string | null
          final_price: number
          id?: string
          is_giftcard?: boolean
          mercado_pago_payment_id?: string | null
          mercado_pago_preference_id?: string | null
          mercado_pago_status?: string | null
          mercado_pago_status_detail?: string | null
          order_type: string
          original_price: number
          package_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          abandonment_email_sent_at?: string | null
          buyer_email?: string
          buyer_name?: string
          buyer_phone?: string | null
          coupon_code?: string | null
          coupon_id?: string | null
          created_at?: string
          discount_amount?: number
          error_message?: string | null
          final_price?: number
          id?: string
          is_giftcard?: boolean
          mercado_pago_payment_id?: string | null
          mercado_pago_preference_id?: string | null
          mercado_pago_status?: string | null
          mercado_pago_status_detail?: string | null
          order_type?: string
          original_price?: number
          package_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_orders_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "discount_coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_orders_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "session_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      professionals: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          branch_id: string | null
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean
          max_capacity: number
          name: string
          price_clp: number
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          branch_id?: string | null
          created_at?: string
          description?: string | null
          duration_minutes: number
          id?: string
          is_active?: boolean
          max_capacity?: number
          name: string
          price_clp: number
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          branch_id?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          max_capacity?: number
          name?: string
          price_clp?: number
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      session_codes: {
        Row: {
          applicable_service_ids: string[]
          buyer_email: string
          buyer_name: string
          buyer_phone: string | null
          code: string
          created_at: string | null
          expires_at: string
          giftcard_access_token: string | null
          id: string
          is_used: boolean | null
          mercado_pago_payment_id: string | null
          package_id: string | null
          purchased_at: string | null
          used_at: string | null
          used_in_booking_id: string | null
        }
        Insert: {
          applicable_service_ids: string[]
          buyer_email: string
          buyer_name: string
          buyer_phone?: string | null
          code: string
          created_at?: string | null
          expires_at: string
          giftcard_access_token?: string | null
          id?: string
          is_used?: boolean | null
          mercado_pago_payment_id?: string | null
          package_id?: string | null
          purchased_at?: string | null
          used_at?: string | null
          used_in_booking_id?: string | null
        }
        Update: {
          applicable_service_ids?: string[]
          buyer_email?: string
          buyer_name?: string
          buyer_phone?: string | null
          code?: string
          created_at?: string | null
          expires_at?: string
          giftcard_access_token?: string | null
          id?: string
          is_used?: boolean | null
          mercado_pago_payment_id?: string | null
          package_id?: string | null
          purchased_at?: string | null
          used_at?: string | null
          used_in_booking_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_codes_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "session_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_codes_used_in_booking_id_fkey"
            columns: ["used_in_booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      session_packages: {
        Row: {
          applicable_service_ids: string[]
          available_as_giftcard: boolean | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          price_clp: number
          sessions_quantity: number
          show_in_criomedicina: boolean | null
          show_in_upsell_modal: boolean | null
          updated_at: string | null
          validity_days: number
        }
        Insert: {
          applicable_service_ids: string[]
          available_as_giftcard?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price_clp: number
          sessions_quantity: number
          show_in_criomedicina?: boolean | null
          show_in_upsell_modal?: boolean | null
          updated_at?: string | null
          validity_days?: number
        }
        Update: {
          applicable_service_ids?: string[]
          available_as_giftcard?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_clp?: number
          sessions_quantity?: number
          show_in_criomedicina?: boolean | null
          show_in_upsell_modal?: boolean | null
          updated_at?: string | null
          validity_days?: number
        }
        Relationships: []
      }
      trial_bookings: {
        Row: {
          class_day: string
          class_time: string
          class_title: string
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          id: string
          mailerlite_synced: boolean
          scheduled_date: string
          source: string
          status: string
          updated_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          class_day: string
          class_time: string
          class_title: string
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          id?: string
          mailerlite_synced?: boolean
          scheduled_date: string
          source?: string
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          class_day?: string
          class_time?: string
          class_title?: string
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          mailerlite_synced?: boolean
          scheduled_date?: string
          source?: string
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_active_professionals: {
        Args: never
        Returns: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
