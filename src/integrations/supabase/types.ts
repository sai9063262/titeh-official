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
      air_quality_data: {
        Row: {
          aqi: number
          city: string
          district: string
          health_recommendations: string | null
          id: string
          last_updated: string | null
          latitude: number
          location: string
          longitude: number
          o3: number | null
          pm10: number | null
          pm25: number | null
        }
        Insert: {
          aqi: number
          city: string
          district: string
          health_recommendations?: string | null
          id?: string
          last_updated?: string | null
          latitude: number
          location: string
          longitude: number
          o3?: number | null
          pm10?: number | null
          pm25?: number | null
        }
        Update: {
          aqi?: number
          city?: string
          district?: string
          health_recommendations?: string | null
          id?: string
          last_updated?: string | null
          latitude?: number
          location?: string
          longitude?: number
          o3?: number | null
          pm10?: number | null
          pm25?: number | null
        }
        Relationships: []
      }
      learning_progress: {
        Row: {
          activity_type: string
          id: string
          is_correct: boolean
          question_id: string
          timestamp: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          id?: string
          is_correct: boolean
          question_id: string
          timestamp?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          id?: string
          is_correct?: boolean
          question_id?: string
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mock_test_results: {
        Row: {
          id: string
          passed: boolean
          questions_count: number
          score: number
          time_taken: number
          timestamp: string | null
          user_id: string
        }
        Insert: {
          id?: string
          passed: boolean
          questions_count: number
          score: number
          time_taken: number
          timestamp?: string | null
          user_id: string
        }
        Update: {
          id?: string
          passed?: boolean
          questions_count?: number
          score?: number
          time_taken?: number
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      vehicle_recalls: {
        Row: {
          affected_parts: string[] | null
          city: string | null
          contact_info: string | null
          district: string | null
          id: string
          manufacturer: string
          model: string
          recall_date: string
          recall_reason: string
          recommended_action: string | null
          year_from: number
          year_to: number | null
        }
        Insert: {
          affected_parts?: string[] | null
          city?: string | null
          contact_info?: string | null
          district?: string | null
          id?: string
          manufacturer: string
          model: string
          recall_date: string
          recall_reason: string
          recommended_action?: string | null
          year_from: number
          year_to?: number | null
        }
        Update: {
          affected_parts?: string[] | null
          city?: string | null
          contact_info?: string | null
          district?: string | null
          id?: string
          manufacturer?: string
          model?: string
          recall_date?: string
          recall_reason?: string
          recommended_action?: string | null
          year_from?: number
          year_to?: number | null
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
    Enums: {},
  },
} as const
