export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      business_supplies: {
        Row: {
          category: string
          cost_per_unit: number
          created_at: string | null
          id: string
          image_url: string | null
          low_stock_threshold: number | null
          name: string
          notes: string | null
          quantity: number
          supplier: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          cost_per_unit: number
          created_at?: string | null
          id?: string
          image_url?: string | null
          low_stock_threshold?: number | null
          name: string
          notes?: string | null
          quantity?: number
          supplier?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          cost_per_unit?: number
          created_at?: string | null
          id?: string
          image_url?: string | null
          low_stock_threshold?: number | null
          name?: string
          notes?: string | null
          quantity?: number
          supplier?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_supplies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          all_day: boolean | null
          category: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          reminder_minutes: number | null
          start_date: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          all_day?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          reminder_minutes?: number | null
          start_date: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          all_day?: boolean | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          reminder_minutes?: number | null
          start_date?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          alias: string | null
          created_at: string | null
          emoji: string | null
          id: string
          last_purchase: string | null
          name: string
          notes: string | null
          platform: string
          total_orders: number | null
          total_profit: number | null
          total_spent: number | null
          trusted_buyer: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          alias?: string | null
          created_at?: string | null
          emoji?: string | null
          id?: string
          last_purchase?: string | null
          name: string
          notes?: string | null
          platform: string
          total_orders?: number | null
          total_profit?: number | null
          total_spent?: number | null
          trusted_buyer?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          alias?: string | null
          created_at?: string | null
          emoji?: string | null
          id?: string
          last_purchase?: string | null
          name?: string
          notes?: string | null
          platform?: string
          total_orders?: number | null
          total_profit?: number | null
          total_spent?: number | null
          trusted_buyer?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          cost_per_ounce: number
          created_at: string | null
          id: string
          image_url: string | null
          notes: string | null
          price_per_gram: number
          purchase_date: string
          quantity: number
          quantity_unit: string
          strain_id: string
          total_cost: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cost_per_ounce: number
          created_at?: string | null
          id?: string
          image_url?: string | null
          notes?: string | null
          price_per_gram: number
          purchase_date: string
          quantity: number
          quantity_unit: string
          strain_id: string
          total_cost: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cost_per_ounce?: number
          created_at?: string | null
          id?: string
          image_url?: string | null
          notes?: string | null
          price_per_gram?: number
          purchase_date?: string
          quantity?: number
          quantity_unit?: string
          strain_id?: string
          total_cost?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_strain_id_fkey"
            columns: ["strain_id"]
            isOneToOne: false
            referencedRelation: "strains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          color: string | null
          content: string | null
          created_at: string | null
          height: number | null
          id: string
          is_pinned: boolean | null
          position_x: number | null
          position_y: number | null
          title: string
          updated_at: string | null
          user_id: string
          width: number | null
        }
        Insert: {
          color?: string | null
          content?: string | null
          created_at?: string | null
          height?: number | null
          id?: string
          is_pinned?: boolean | null
          position_x?: number | null
          position_y?: number | null
          title: string
          updated_at?: string | null
          user_id: string
          width?: number | null
        }
        Update: {
          color?: string | null
          content?: string | null
          created_at?: string | null
          height?: number | null
          id?: string
          is_pinned?: boolean | null
          position_x?: number | null
          position_y?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      sales: {
        Row: {
          cost_per_gram: number
          created_at: string | null
          customer_id: string | null
          date: string
          id: string
          image_url: string | null
          notes: string | null
          payment_method: string | null
          profit: number
          quantity: number
          sale_price: number
          strain_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cost_per_gram: number
          created_at?: string | null
          customer_id?: string | null
          date: string
          id?: string
          image_url?: string | null
          notes?: string | null
          payment_method?: string | null
          profit: number
          quantity: number
          sale_price: number
          strain_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cost_per_gram?: number
          created_at?: string | null
          customer_id?: string | null
          date?: string
          id?: string
          image_url?: string | null
          notes?: string | null
          payment_method?: string | null
          profit?: number
          quantity?: number
          sale_price?: number
          strain_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_strain_id_fkey"
            columns: ["strain_id"]
            isOneToOne: false
            referencedRelation: "strains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      strains: {
        Row: {
          cost_per_gram: number
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cost_per_gram: number
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cost_per_gram?: number
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "strains_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tick_ledger: {
        Row: {
          amount: number
          created_at: string | null
          customer_id: string
          date: string
          description: string
          due_date: string | null
          id: string
          notes: string | null
          paid: number | null
          remaining: number
          sale_id: string | null
          status: Database["public"]["Enums"]["tick_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          customer_id: string
          date: string
          description: string
          due_date?: string | null
          id?: string
          notes?: string | null
          paid?: number | null
          remaining: number
          sale_id?: string | null
          status?: Database["public"]["Enums"]["tick_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          customer_id?: string
          date?: string
          description?: string
          due_date?: string | null
          id?: string
          notes?: string | null
          paid?: number | null
          remaining?: number
          sale_id?: string | null
          status?: Database["public"]["Enums"]["tick_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tick_ledger_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tick_ledger_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tick_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
      app_role: "admin" | "user"
      notification_type: "low_stock" | "payment_due" | "reminder" | "general"
      tick_status: "outstanding" | "partial" | "paid"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      notification_type: ["low_stock", "payment_due", "reminder", "general"],
      tick_status: ["outstanding", "partial", "paid"],
    },
  },
} as const
