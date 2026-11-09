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
      ai_knowledge: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          is_active: boolean
          priority: number
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          priority?: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          priority?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
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
          meta_context: Json | null
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
          meta_context?: Json | null
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
          meta_context?: Json | null
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
      chat_conversations: {
        Row: {
          created_at: string
          first_user_message: string | null
          id: string
          ip_address: string | null
          message_count: number
          messages: Json
          session_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          first_user_message?: string | null
          id?: string
          ip_address?: string | null
          message_count?: number
          messages?: Json
          session_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          first_user_message?: string | null
          id?: string
          ip_address?: string | null
          message_count?: number
          messages?: Json
          session_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_events: {
        Row: {
          amount: number | null
          created_at: string
          customer_id: string
          description: string | null
          event_date: string
          event_type: string
          id: string
          metadata: Json
          title: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          customer_id: string
          description?: string | null
          event_date?: string
          event_type: string
          id?: string
          metadata?: Json
          title: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          customer_id?: string
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          metadata?: Json
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_events_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_memberships: {
        Row: {
          created_at: string
          customer_id: string
          end_date: string | null
          id: string
          membership_plan_id: string
          notes: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          end_date?: string | null
          id?: string
          membership_plan_id: string
          notes?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          end_date?: string | null
          id?: string
          membership_plan_id?: string
          notes?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_memberships_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_memberships_membership_plan_id_fkey"
            columns: ["membership_plan_id"]
            isOneToOne: false
            referencedRelation: "membership_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      cyber_nave_subscribers: {
        Row: {
          consent: boolean
          consent_at: string | null
          consent_version: string | null
          created_at: string
          delivery_attempts: number
          delivery_error: string | null
          delivery_status: string
          email: string
          id: string
          ip_hash: string | null
          last_attempt_at: string | null
          name: string | null
          resend_email_id: string | null
          sent_at: string | null
          source: string
          updated_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          consent?: boolean
          consent_at?: string | null
          consent_version?: string | null
          created_at?: string
          delivery_attempts?: number
          delivery_error?: string | null
          delivery_status?: string
          email: string
          id?: string
          ip_hash?: string | null
          last_attempt_at?: string | null
          name?: string | null
          resend_email_id?: string | null
          sent_at?: string | null
          source?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          consent?: boolean
          consent_at?: string | null
          consent_version?: string | null
          created_at?: string
          delivery_attempts?: number
          delivery_error?: string | null
          delivery_status?: string
          email?: string
          id?: string
          ip_hash?: string | null
          last_attempt_at?: string | null
          name?: string | null
          resend_email_id?: string | null
          sent_at?: string | null
          source?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      cyber_products: {
        Row: {
          campaign: string
          created_at: string
          ends_at: string
          id: string
          invite_codes: number
          is_active: boolean
          kind: string
          months_free: number | null
          months_paid: number | null
          months_total: number | null
          name: string
          own_codes: number
          plan_name: string | null
          price: number
          regular_price: number
          sku: string
          stock_pool: string | null
          validity_months: number
        }
        Insert: {
          campaign?: string
          created_at?: string
          ends_at?: string
          id: string
          invite_codes?: number
          is_active?: boolean
          kind: string
          months_free?: number | null
          months_paid?: number | null
          months_total?: number | null
          name: string
          own_codes?: number
          plan_name?: string | null
          price: number
          regular_price: number
          sku: string
          stock_pool?: string | null
          validity_months?: number
        }
        Update: {
          campaign?: string
          created_at?: string
          ends_at?: string
          id?: string
          invite_codes?: number
          is_active?: boolean
          kind?: string
          months_free?: number | null
          months_paid?: number | null
          months_total?: number | null
          name?: string
          own_codes?: number
          plan_name?: string | null
          price?: number
          regular_price?: number
          sku?: string
          stock_pool?: string | null
          validity_months?: number
        }
        Relationships: []
      }
      cyber_purchases: {
        Row: {
          activation_status: string
          admin_notes: string | null
          buyer_email: string
          buyer_name: string
          buyer_phone: string | null
          codes_expire_at: string | null
          created_at: string
          id: string
          invite_codes: string[]
          kind: string
          mercado_pago_payment_id: string | null
          months_free: number | null
          months_paid: number | null
          months_total: number | null
          own_codes: string[]
          paid_at: string | null
          payment_status: string
          plan_name: string | null
          product_id: string
          product_name: string
          quantity: number
          shop_order_id: string
          sku: string
          total_amount: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          activation_status?: string
          admin_notes?: string | null
          buyer_email: string
          buyer_name: string
          buyer_phone?: string | null
          codes_expire_at?: string | null
          created_at?: string
          id?: string
          invite_codes?: string[]
          kind: string
          mercado_pago_payment_id?: string | null
          months_free?: number | null
          months_paid?: number | null
          months_total?: number | null
          own_codes?: string[]
          paid_at?: string | null
          payment_status?: string
          plan_name?: string | null
          product_id: string
          product_name: string
          quantity?: number
          shop_order_id: string
          sku: string
          total_amount: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          activation_status?: string
          admin_notes?: string | null
          buyer_email?: string
          buyer_name?: string
          buyer_phone?: string | null
          codes_expire_at?: string | null
          created_at?: string
          id?: string
          invite_codes?: string[]
          kind?: string
          mercado_pago_payment_id?: string | null
          months_free?: number | null
          months_paid?: number | null
          months_total?: number | null
          own_codes?: string[]
          paid_at?: string | null
          payment_status?: string
          plan_name?: string | null
          product_id?: string
          product_name?: string
          quantity?: number
          shop_order_id?: string
          sku?: string
          total_amount?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cyber_purchases_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "cyber_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cyber_purchases_shop_order_id_fkey"
            columns: ["shop_order_id"]
            isOneToOne: false
            referencedRelation: "shop_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      cyber_stock: {
        Row: {
          label: string
          pool: string
          sold: number
          sort_order: number
          total: number
          updated_at: string
        }
        Insert: {
          label: string
          pool: string
          sold?: number
          sort_order?: number
          total?: number
          updated_at?: string
        }
        Update: {
          label?: string
          pool?: string
          sold?: number
          sort_order?: number
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      discount_coupons: {
        Row: {
          applicable_event_ids: string[]
          applicable_package_ids: string[] | null
          applies_to_talleres: boolean
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
          applicable_event_ids?: string[]
          applicable_package_ids?: string[] | null
          applies_to_talleres?: boolean
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
          applicable_event_ids?: string[]
          applicable_package_ids?: string[] | null
          applies_to_talleres?: boolean
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
      email_campaign_sends: {
        Row: {
          campaign: string
          email: string
          id: string
          sent_at: string
        }
        Insert: {
          campaign: string
          email: string
          id?: string
          sent_at?: string
        }
        Update: {
          campaign?: string
          email?: string
          id?: string
          sent_at?: string
        }
        Relationships: []
      }
      email_optouts: {
        Row: {
          created_at: string
          email: string
          id: string
          list_type: string
          opted_out_at: string | null
          token: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          list_type?: string
          opted_out_at?: string | null
          token?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          list_type?: string
          opted_out_at?: string | null
          token?: string
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
      event_cupos: {
        Row: {
          created_at: string
          cupos_total: number
          cupos_vendidos: number
          event_id: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cupos_total?: number
          cupos_vendidos?: number
          event_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cupos_total?: number
          cupos_vendidos?: number
          event_id?: string
          id?: string
          updated_at?: string
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
      icefest_discounts: {
        Row: {
          code: string | null
          combinable: boolean
          created_at: string
          discount_type: string
          discount_value: number
          event_id: string
          id: string
          is_active: boolean
          max_quantity: number | null
          max_uses: number | null
          min_purchase_amount: number
          min_quantity: number
          name: string
          ticket_type_id: string | null
          times_used: number
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code?: string | null
          combinable?: boolean
          created_at?: string
          discount_type?: string
          discount_value: number
          event_id: string
          id?: string
          is_active?: boolean
          max_quantity?: number | null
          max_uses?: number | null
          min_purchase_amount?: number
          min_quantity?: number
          name: string
          ticket_type_id?: string | null
          times_used?: number
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string | null
          combinable?: boolean
          created_at?: string
          discount_type?: string
          discount_value?: number
          event_id?: string
          id?: string
          is_active?: boolean
          max_quantity?: number | null
          max_uses?: number | null
          min_purchase_amount?: number
          min_quantity?: number
          name?: string
          ticket_type_id?: string | null
          times_used?: number
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "icefest_discounts_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "icefest_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icefest_discounts_ticket_type_id_fkey"
            columns: ["ticket_type_id"]
            isOneToOne: false
            referencedRelation: "icefest_ticket_types"
            referencedColumns: ["id"]
          },
        ]
      }
      icefest_events: {
        Row: {
          address: string
          created_at: string
          date: string
          description: string
          google_maps_link: string
          id: string
          includes_cacao: boolean
          includes_lunch: boolean
          instructions: string
          is_active: boolean
          location: string
          name: string
          sales_open: boolean
          schedule: string
          slug: string
          updated_at: string
          whatsapp_link: string
        }
        Insert: {
          address?: string
          created_at?: string
          date: string
          description?: string
          google_maps_link?: string
          id?: string
          includes_cacao?: boolean
          includes_lunch?: boolean
          instructions?: string
          is_active?: boolean
          location?: string
          name: string
          sales_open?: boolean
          schedule?: string
          slug: string
          updated_at?: string
          whatsapp_link?: string
        }
        Update: {
          address?: string
          created_at?: string
          date?: string
          description?: string
          google_maps_link?: string
          id?: string
          includes_cacao?: boolean
          includes_lunch?: boolean
          instructions?: string
          is_active?: boolean
          location?: string
          name?: string
          sales_open?: boolean
          schedule?: string
          slug?: string
          updated_at?: string
          whatsapp_link?: string
        }
        Relationships: []
      }
      icefest_orders: {
        Row: {
          access_token: string
          admin_notes: string
          buyer_email: string
          buyer_name: string
          buyer_phone: string
          buyer_surname: string
          created_at: string
          details_sent_at: string | null
          discount_amount: number
          discount_ids: string[]
          email_error: string | null
          email_lock_until: string | null
          event_id: string
          id: string
          meta_context: Json
          original_amount: number
          paid_at: string | null
          payment_id: string | null
          payment_status: string | null
          preference_id: string | null
          quantity: number
          receipt_sent_at: string | null
          recovery_sent_at: string | null
          reserved_until: string
          source: string
          source_order_id: string | null
          status: string
          ticket_type_id: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          access_token?: string
          admin_notes?: string
          buyer_email: string
          buyer_name: string
          buyer_phone?: string
          buyer_surname?: string
          created_at?: string
          details_sent_at?: string | null
          discount_amount?: number
          discount_ids?: string[]
          email_error?: string | null
          email_lock_until?: string | null
          event_id: string
          id?: string
          meta_context?: Json
          original_amount: number
          paid_at?: string | null
          payment_id?: string | null
          payment_status?: string | null
          preference_id?: string | null
          quantity: number
          receipt_sent_at?: string | null
          recovery_sent_at?: string | null
          reserved_until?: string
          source?: string
          source_order_id?: string | null
          status?: string
          ticket_type_id: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          access_token?: string
          admin_notes?: string
          buyer_email?: string
          buyer_name?: string
          buyer_phone?: string
          buyer_surname?: string
          created_at?: string
          details_sent_at?: string | null
          discount_amount?: number
          discount_ids?: string[]
          email_error?: string | null
          email_lock_until?: string | null
          event_id?: string
          id?: string
          meta_context?: Json
          original_amount?: number
          paid_at?: string | null
          payment_id?: string | null
          payment_status?: string | null
          preference_id?: string | null
          quantity?: number
          receipt_sent_at?: string | null
          recovery_sent_at?: string | null
          reserved_until?: string
          source?: string
          source_order_id?: string | null
          status?: string
          ticket_type_id?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "icefest_orders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "icefest_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icefest_orders_ticket_type_id_fkey"
            columns: ["ticket_type_id"]
            isOneToOne: false
            referencedRelation: "icefest_ticket_types"
            referencedColumns: ["id"]
          },
        ]
      }
      icefest_ticket_types: {
        Row: {
          created_at: string
          description: string
          display_order: number
          event_id: string
          id: string
          is_active: boolean
          max_per_order: number
          name: string
          price: number
          stock: number | null
          stock_sold: number
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          description?: string
          display_order?: number
          event_id: string
          id?: string
          is_active?: boolean
          max_per_order?: number
          name: string
          price?: number
          stock?: number | null
          stock_sold?: number
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          event_id?: string
          id?: string
          is_active?: boolean
          max_per_order?: number
          name?: string
          price?: number
          stock?: number | null
          stock_sold?: number
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "icefest_ticket_types_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "icefest_events"
            referencedColumns: ["id"]
          },
        ]
      }
      icefest_tickets: {
        Row: {
          access_token: string
          checked_in: boolean
          checked_in_at: string | null
          checked_in_by: string | null
          created_at: string
          event_id: string
          id: string
          is_valid: boolean
          order_id: string
          ticket_code: string
          ticket_number: number
        }
        Insert: {
          access_token?: string
          checked_in?: boolean
          checked_in_at?: string | null
          checked_in_by?: string | null
          created_at?: string
          event_id: string
          id?: string
          is_valid?: boolean
          order_id: string
          ticket_code?: string
          ticket_number: number
        }
        Update: {
          access_token?: string
          checked_in?: boolean
          checked_in_at?: string | null
          checked_in_by?: string | null
          created_at?: string
          event_id?: string
          id?: string
          is_valid?: boolean
          order_id?: string
          ticket_code?: string
          ticket_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "icefest_tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "icefest_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "icefest_tickets_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "icefest_orders"
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
      internal_cron_tokens: {
        Row: {
          created_at: string
          name: string
          token: string
        }
        Insert: {
          created_at?: string
          name: string
          token?: string
        }
        Update: {
          created_at?: string
          name?: string
          token?: string
        }
        Relationships: []
      }
      membership_leads: {
        Row: {
          admin_notes: string | null
          boxmagic_url: string | null
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          id: string
          paid_at: string | null
          paid_marked_by: string | null
          plan_code: string | null
          plan_group: string | null
          plan_label: string | null
          redirected_at: string | null
          requested_start_date: string | null
          status: string
          updated_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          admin_notes?: string | null
          boxmagic_url?: string | null
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          id?: string
          paid_at?: string | null
          paid_marked_by?: string | null
          plan_code?: string | null
          plan_group?: string | null
          plan_label?: string | null
          redirected_at?: string | null
          requested_start_date?: string | null
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          admin_notes?: string | null
          boxmagic_url?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          paid_at?: string | null
          paid_marked_by?: string | null
          plan_code?: string | null
          plan_group?: string | null
          plan_label?: string | null
          redirected_at?: string | null
          requested_start_date?: string | null
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      membership_plans: {
        Row: {
          allows_custom_start_date: boolean
          classes_included: number
          created_at: string
          description: string | null
          duration_days: number | null
          frequency: string
          id: string
          is_active: boolean
          name: string
          original_price_clp: number | null
          plan_type: string
          price_clp: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          allows_custom_start_date?: boolean
          classes_included: number
          created_at?: string
          description?: string | null
          duration_days?: number | null
          frequency: string
          id?: string
          is_active?: boolean
          name: string
          original_price_clp?: number | null
          plan_type?: string
          price_clp: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          allows_custom_start_date?: boolean
          classes_included?: number
          created_at?: string
          description?: string | null
          duration_days?: number | null
          frequency?: string
          id?: string
          is_active?: boolean
          name?: string
          original_price_clp?: number | null
          plan_type?: string
          price_clp?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      meta_event_deliveries: {
        Row: {
          attempts: number
          created_at: string
          entity_id: string | null
          entity_type: string | null
          error_code: string | null
          error_message: string | null
          event_id: string
          event_name: string
          event_time: string
          funnel: string | null
          id: string
          meta_trace_id: string | null
          sent_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          error_code?: string | null
          error_message?: string | null
          event_id: string
          event_name: string
          event_time?: string
          funnel?: string | null
          id?: string
          meta_trace_id?: string | null
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          error_code?: string | null
          error_message?: string | null
          event_id?: string
          event_name?: string
          event_time?: string
          funnel?: string | null
          id?: string
          meta_trace_id?: string | null
          sent_at?: string | null
          status?: string
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
          meta_context: Json | null
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
          meta_context?: Json | null
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
          meta_context?: Json | null
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
          customer_id: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_entries: {
        Row: {
          badges: string[]
          created_at: string
          day_of_week: number
          display_name: string | null
          id: string
          is_active: boolean
          professional_id: string | null
          service_id: string
          sort_order: number
          start_time: string
          updated_at: string
        }
        Insert: {
          badges?: string[]
          created_at?: string
          day_of_week: number
          display_name?: string | null
          id?: string
          is_active?: boolean
          professional_id?: string | null
          service_id: string
          sort_order?: number
          start_time: string
          updated_at?: string
        }
        Update: {
          badges?: string[]
          created_at?: string
          day_of_week?: number
          display_name?: string | null
          id?: string
          is_active?: boolean
          professional_id?: string | null
          service_id?: string
          sort_order?: number
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedule_entries_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_entries_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          branch_id: string | null
          color_tag: string
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean
          is_trial_enabled: boolean
          max_capacity: number
          name: string
          price_clp: number
          show_in_agenda: boolean
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          branch_id?: string | null
          color_tag?: string
          created_at?: string
          description?: string | null
          duration_minutes: number
          id?: string
          is_active?: boolean
          is_trial_enabled?: boolean
          max_capacity?: number
          name: string
          price_clp: number
          show_in_agenda?: boolean
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          branch_id?: string | null
          color_tag?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean
          is_trial_enabled?: boolean
          max_capacity?: number
          name?: string
          price_clp?: number
          show_in_agenda?: boolean
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
          code_composition: Json | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_private: boolean
          name: string
          price_clp: number
          sessions_quantity: number
          show_in_criomedicina: boolean | null
          show_in_upsell_modal: boolean | null
          sort_order: number
          updated_at: string | null
          validity_days: number
        }
        Insert: {
          applicable_service_ids: string[]
          available_as_giftcard?: boolean | null
          code_composition?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_private?: boolean
          name: string
          price_clp: number
          sessions_quantity: number
          show_in_criomedicina?: boolean | null
          show_in_upsell_modal?: boolean | null
          sort_order?: number
          updated_at?: string | null
          validity_days?: number
        }
        Update: {
          applicable_service_ids?: string[]
          available_as_giftcard?: boolean | null
          code_composition?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_private?: boolean
          name?: string
          price_clp?: number
          sessions_quantity?: number
          show_in_criomedicina?: boolean | null
          show_in_upsell_modal?: boolean | null
          sort_order?: number
          updated_at?: string | null
          validity_days?: number
        }
        Relationships: []
      }
      shop_orders: {
        Row: {
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          id: string
          mercado_pago_payment_id: string | null
          mercado_pago_preference_id: string | null
          meta_context: Json | null
          paid_at: string | null
          product_id: string | null
          product_name: string
          product_price: number
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          id?: string
          mercado_pago_payment_id?: string | null
          mercado_pago_preference_id?: string | null
          meta_context?: Json | null
          paid_at?: string | null
          product_id?: string | null
          product_name: string
          product_price: number
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          id?: string
          mercado_pago_payment_id?: string | null
          mercado_pago_preference_id?: string | null
          meta_context?: Json | null
          paid_at?: string | null
          product_id?: string | null
          product_name?: string
          product_price?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shop_orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "shop_products"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_products: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          image_urls: string[]
          is_active: boolean
          name: string
          price: number
          short_description: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          image_urls?: string[]
          is_active?: boolean
          name: string
          price: number
          short_description?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          image_urls?: string[]
          is_active?: boolean
          name?: string
          price?: number
          short_description?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      taller_inscripciones: {
        Row: {
          amount: number
          apellido: string
          coupon_code: string | null
          coupon_id: string | null
          created_at: string
          cupo_reserved: boolean
          discount_amount: number
          email: string
          event_id: string
          event_ids: string[]
          fecha_evento: string
          horario: string
          id: string
          mercado_pago_payment_id: string | null
          mercado_pago_preference_id: string | null
          mercado_pago_status: string | null
          meta_context: Json | null
          nivel: string
          nombre: string
          notification_error: string | null
          original_amount: number | null
          paid_at: string | null
          phone: string
          product_type: string
          quantity: number
          slug: string
          source: string
          status: string
          taller_nombre: string
          updated_at: string
        }
        Insert: {
          amount: number
          apellido: string
          coupon_code?: string | null
          coupon_id?: string | null
          created_at?: string
          cupo_reserved?: boolean
          discount_amount?: number
          email: string
          event_id: string
          event_ids?: string[]
          fecha_evento: string
          horario: string
          id?: string
          mercado_pago_payment_id?: string | null
          mercado_pago_preference_id?: string | null
          mercado_pago_status?: string | null
          meta_context?: Json | null
          nivel: string
          nombre: string
          notification_error?: string | null
          original_amount?: number | null
          paid_at?: string | null
          phone: string
          product_type?: string
          quantity?: number
          slug?: string
          source?: string
          status?: string
          taller_nombre: string
          updated_at?: string
        }
        Update: {
          amount?: number
          apellido?: string
          coupon_code?: string | null
          coupon_id?: string | null
          created_at?: string
          cupo_reserved?: boolean
          discount_amount?: number
          email?: string
          event_id?: string
          event_ids?: string[]
          fecha_evento?: string
          horario?: string
          id?: string
          mercado_pago_payment_id?: string | null
          mercado_pago_preference_id?: string | null
          mercado_pago_status?: string | null
          meta_context?: Json | null
          nivel?: string
          nombre?: string
          notification_error?: string | null
          original_amount?: number | null
          paid_at?: string | null
          phone?: string
          product_type?: string
          quantity?: number
          slug?: string
          source?: string
          status?: string
          taller_nombre?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "taller_inscripciones_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "discount_coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      taller_santiago_avanzado: {
        Row: {
          consent: boolean
          created_at: string
          email: string
          id: string
          name: string
          paid: boolean
          phone: string
        }
        Insert: {
          consent?: boolean
          created_at?: string
          email: string
          id?: string
          name: string
          paid?: boolean
          phone: string
        }
        Update: {
          consent?: boolean
          created_at?: string
          email?: string
          id?: string
          name?: string
          paid?: boolean
          phone?: string
        }
        Relationships: []
      }
      taller_santiago_fundamentos: {
        Row: {
          consent: boolean
          created_at: string
          email: string
          id: string
          name: string
          paid: boolean
          phone: string
        }
        Insert: {
          consent?: boolean
          created_at?: string
          email: string
          id?: string
          name: string
          paid?: boolean
          phone: string
        }
        Update: {
          consent?: boolean
          created_at?: string
          email?: string
          id?: string
          name?: string
          paid?: boolean
          phone?: string
        }
        Relationships: []
      }
      taller_thankyou_logs: {
        Row: {
          attempts: number
          created_at: string
          email: string
          error_message: string | null
          event_id: string
          id: string
          idempotency_key: string | null
          inscripcion_id: string
          resend_email_id: string | null
          sent_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          email: string
          error_message?: string | null
          event_id: string
          id?: string
          idempotency_key?: string | null
          inscripcion_id: string
          resend_email_id?: string | null
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          attempts?: number
          created_at?: string
          email?: string
          error_message?: string | null
          event_id?: string
          id?: string
          idempotency_key?: string | null
          inscripcion_id?: string
          resend_email_id?: string | null
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      trial_alert_state: {
        Row: {
          id: string
          sent_at: string
          signature: string
        }
        Insert: {
          id: string
          sent_at?: string
          signature: string
        }
        Update: {
          id?: string
          sent_at?: string
          signature?: string
        }
        Relationships: []
      }
      trial_bookings: {
        Row: {
          actual_end_date: string | null
          actual_start_date: string | null
          admin_notes: string | null
          class_day: string
          class_time: string
          class_title: string
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          id: string
          mailerlite_synced: boolean
          paid_at: string | null
          paid_marked_by: string | null
          plan_type: string | null
          recovery_email_sent_at: string | null
          redirected_to_boxmagic_at: string | null
          reminder_sent: string[]
          requested_start_date: string | null
          scheduled_date: string
          source: string
          status: string
          updated_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          actual_end_date?: string | null
          actual_start_date?: string | null
          admin_notes?: string | null
          class_day: string
          class_time: string
          class_title: string
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          id?: string
          mailerlite_synced?: boolean
          paid_at?: string | null
          paid_marked_by?: string | null
          plan_type?: string | null
          recovery_email_sent_at?: string | null
          redirected_to_boxmagic_at?: string | null
          reminder_sent?: string[]
          requested_start_date?: string | null
          scheduled_date: string
          source?: string
          status?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          actual_end_date?: string | null
          actual_start_date?: string | null
          admin_notes?: string | null
          class_day?: string
          class_time?: string
          class_title?: string
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          mailerlite_synced?: boolean
          paid_at?: string | null
          paid_marked_by?: string | null
          plan_type?: string | null
          recovery_email_sent_at?: string | null
          redirected_to_boxmagic_at?: string | null
          reminder_sent?: string[]
          requested_start_date?: string | null
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
      trial_reminder_logs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          lead_id: string
          reminder_day: number
          scheduled_for: string
          sent_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          lead_id: string
          reminder_day: number
          scheduled_for: string
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          lead_id?: string
          reminder_day?: number
          scheduled_for?: string
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trial_reminder_logs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "trial_bookings"
            referencedColumns: ["id"]
          },
        ]
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
      weekly_reminder_logs: {
        Row: {
          buyer_name: string | null
          email: string
          error_message: string | null
          id: string
          remaining: number | null
          sent_at: string
          status: string
          subject: string | null
          week_key: string
        }
        Insert: {
          buyer_name?: string | null
          email: string
          error_message?: string | null
          id?: string
          remaining?: number | null
          sent_at?: string
          status?: string
          subject?: string | null
          week_key: string
        }
        Update: {
          buyer_name?: string | null
          email?: string
          error_message?: string | null
          id?: string
          remaining?: number | null
          sent_at?: string
          status?: string
          subject?: string | null
          week_key?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      confirm_taller_payment: {
        Args: {
          _order_id: string
          _paid_amount: number
          _payment_id: string
          _payment_status: string
        }
        Returns: Json
      }
      cyber_stock_add: {
        Args: { _pool: string; _qty: number }
        Returns: undefined
      }
      execute_readonly_query: { Args: { query_text: string }; Returns: Json }
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
      get_user_customer_email: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      icefest_check_in: { Args: { _ticket_id: string }; Returns: Json }
      icefest_confirm_order: {
        Args: {
          _amount: number
          _currency?: string
          _order_id: string
          _payment_id: string
        }
        Returns: Json
      }
      icefest_price: {
        Args: { _coupon?: string; _quantity: number; _type_id: string }
        Returns: Json
      }
      icefest_refund_order: { Args: { _order_id: string }; Returns: undefined }
      icefest_reserve_order: {
        Args: {
          _buyer: Json
          _coupon?: string
          _meta?: Json
          _quantity: number
          _type_id: string
        }
        Returns: Json
      }
      reserve_event_cupo: { Args: { _event_id: string }; Returns: number }
      reserve_event_cupos: { Args: { _event_ids: string[] }; Returns: Json }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
