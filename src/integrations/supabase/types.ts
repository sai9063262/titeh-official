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
      admin_audit_logs: {
        Row: {
          action: string
          details: Json | null
          id: string
          performed_at: string | null
          performed_by: string | null
        }
        Insert: {
          action: string
          details?: Json | null
          id?: string
          performed_at?: string | null
          performed_by?: string | null
        }
        Update: {
          action?: string
          details?: Json | null
          id?: string
          performed_at?: string | null
          performed_by?: string | null
        }
        Relationships: []
      }
      breaking_news: {
        Row: {
          author: string | null
          content: string
          created_at: string | null
          created_by: string | null
          expiry_date: string | null
          id: string
          is_published: boolean | null
          priority: string
          publish_date: string | null
          title: string
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          expiry_date?: string | null
          id?: string
          is_published?: boolean | null
          priority: string
          publish_date?: string | null
          title: string
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          expiry_date?: string | null
          id?: string
          is_published?: boolean | null
          priority?: string
          publish_date?: string | null
          title?: string
        }
        Relationships: []
      }
      drivers: {
        Row: {
          address: string | null
          age: string | null
          blood_type: string | null
          created_at: string
          criminal_record_notes: string | null
          criminal_record_status: string | null
          date_of_birth: string | null
          document_url: string | null
          driver_experience_years: number | null
          email: string | null
          emergency_contact_name: string | null
          gender: string | null
          id: string
          language_proficiency: string[] | null
          license_number: string
          medical_conditions: string | null
          name: string
          nationality: string | null
          notes: string | null
          phone_number: string | null
          photo_url: string | null
          preferred_contact_method: string | null
          previous_employers: string | null
          safety_training_date: string | null
          status: string | null
          training_certificates: string[] | null
          updated_at: string
          valid_until: string | null
          vehicle_class: string | null
          vehicle_color: string | null
        }
        Insert: {
          address?: string | null
          age?: string | null
          blood_type?: string | null
          created_at?: string
          criminal_record_notes?: string | null
          criminal_record_status?: string | null
          date_of_birth?: string | null
          document_url?: string | null
          driver_experience_years?: number | null
          email?: string | null
          emergency_contact_name?: string | null
          gender?: string | null
          id?: string
          language_proficiency?: string[] | null
          license_number: string
          medical_conditions?: string | null
          name: string
          nationality?: string | null
          notes?: string | null
          phone_number?: string | null
          photo_url?: string | null
          preferred_contact_method?: string | null
          previous_employers?: string | null
          safety_training_date?: string | null
          status?: string | null
          training_certificates?: string[] | null
          updated_at?: string
          valid_until?: string | null
          vehicle_class?: string | null
          vehicle_color?: string | null
        }
        Update: {
          address?: string | null
          age?: string | null
          blood_type?: string | null
          created_at?: string
          criminal_record_notes?: string | null
          criminal_record_status?: string | null
          date_of_birth?: string | null
          document_url?: string | null
          driver_experience_years?: number | null
          email?: string | null
          emergency_contact_name?: string | null
          gender?: string | null
          id?: string
          language_proficiency?: string[] | null
          license_number?: string
          medical_conditions?: string | null
          name?: string
          nationality?: string | null
          notes?: string | null
          phone_number?: string | null
          photo_url?: string | null
          preferred_contact_method?: string | null
          previous_employers?: string | null
          safety_training_date?: string | null
          status?: string | null
          training_certificates?: string[] | null
          updated_at?: string
          valid_until?: string | null
          vehicle_class?: string | null
          vehicle_color?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      system_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          created_by: string | null
          id: string
          is_sent: boolean | null
          message: string
          send_date: string | null
          target_audience: string
          title: string
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_sent?: boolean | null
          message: string
          send_date?: string | null
          target_audience: string
          title: string
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_sent?: boolean | null
          message?: string
          send_date?: string | null
          target_audience?: string
          title?: string
        }
        Relationships: []
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
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
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
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
