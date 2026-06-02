export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      applications: {
        Row: {
          cover_text: string | null
          created_at: string
          crew_user_id: string
          expected_rate: number | null
          id: string
          job_id: string
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          cover_text?: string | null
          created_at?: string
          crew_user_id: string
          expected_rate?: number | null
          id?: string
          job_id: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
          cover_text?: string | null
          created_at?: string
          crew_user_id?: string
          expected_rate?: number | null
          id?: string
          job_id?: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_crew_user_id_fkey"
            columns: ["crew_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      availability: {
        Row: {
          created_at: string
          crew_user_id: string
          end_date: string
          id: string
          location: string | null
          notes: string | null
          start_date: string
        }
        Insert: {
          created_at?: string
          crew_user_id: string
          end_date: string
          id?: string
          location?: string | null
          notes?: string | null
          start_date: string
        }
        Update: {
          created_at?: string
          crew_user_id?: string
          end_date?: string
          id?: string
          location?: string | null
          notes?: string | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_crew_user_id_fkey"
            columns: ["crew_user_id"]
            isOneToOne: false
            referencedRelation: "crew_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      certifications: {
        Row: {
          created_at: string
          crew_user_id: string
          doc_url: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuer: string | null
          number: string | null
          type: string
          updated_at: string
          verified: boolean
        }
        Insert: {
          created_at?: string
          crew_user_id: string
          doc_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          number?: string | null
          type: string
          updated_at?: string
          verified?: boolean
        }
        Update: {
          created_at?: string
          crew_user_id?: string
          doc_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          number?: string | null
          type?: string
          updated_at?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "certifications_crew_user_id_fkey"
            columns: ["crew_user_id"]
            isOneToOne: false
            referencedRelation: "crew_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      crew_profiles: {
        Row: {
          availability_end: string | null
          availability_start: string | null
          bio: string | null
          boat_length_max: number | null
          boat_length_min: number | null
          boat_types: string[]
          created_at: string
          currency: string
          cv_url: string | null
          experience_months: number
          homeport: string | null
          languages: string[]
          min_day_rate: number | null
          min_monthly: number | null
          name: string
          nationality: string | null
          photo_url: string | null
          primary_role: string
          profile_completeness: number
          secondary_roles: string[]
          updated_at: string
          user_id: string
          willingness_to_travel: boolean
        }
        Insert: {
          availability_end?: string | null
          availability_start?: string | null
          bio?: string | null
          boat_length_max?: number | null
          boat_length_min?: number | null
          boat_types?: string[]
          created_at?: string
          currency?: string
          cv_url?: string | null
          experience_months?: number
          homeport?: string | null
          languages?: string[]
          min_day_rate?: number | null
          min_monthly?: number | null
          name?: string
          nationality?: string | null
          photo_url?: string | null
          primary_role?: string
          profile_completeness?: number
          secondary_roles?: string[]
          updated_at?: string
          user_id: string
          willingness_to_travel?: boolean
        }
        Update: {
          availability_end?: string | null
          availability_start?: string | null
          bio?: string | null
          boat_length_max?: number | null
          boat_length_min?: number | null
          boat_types?: string[]
          created_at?: string
          currency?: string
          cv_url?: string | null
          experience_months?: number
          homeport?: string | null
          languages?: string[]
          min_day_rate?: number | null
          min_monthly?: number | null
          name?: string
          nationality?: string | null
          photo_url?: string | null
          primary_role?: string
          profile_completeness?: number
          secondary_roles?: string[]
          updated_at?: string
          user_id?: string
          willingness_to_travel?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "crew_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          accommodation: string | null
          closed_at: string | null
          contract_type: Database["public"]["Enums"]["contract_type"]
          created_at: string
          currency: string
          day_rate: number | null
          description: string | null
          duration_days: number | null
          id: string
          itinerary: string | null
          itinerary_geojson: string | null
          min_exp_months: number | null
          monthly_rate: number | null
          owner_org_id: string
          posted_at: string | null
          requires_cert_types: string[]
          role: string
          start_date: string
          status: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at: string
          vessel_id: string | null
        }
        Insert: {
          accommodation?: string | null
          closed_at?: string | null
          contract_type?: Database["public"]["Enums"]["contract_type"]
          created_at?: string
          currency?: string
          day_rate?: number | null
          description?: string | null
          duration_days?: number | null
          id?: string
          itinerary?: string | null
          itinerary_geojson?: string | null
          min_exp_months?: number | null
          monthly_rate?: number | null
          owner_org_id: string
          posted_at?: string | null
          requires_cert_types?: string[]
          role: string
          start_date: string
          status?: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at?: string
          vessel_id?: string | null
        }
        Update: {
          accommodation?: string | null
          closed_at?: string | null
          contract_type?: Database["public"]["Enums"]["contract_type"]
          created_at?: string
          currency?: string
          day_rate?: number | null
          description?: string | null
          duration_days?: number | null
          id?: string
          itinerary?: string | null
          itinerary_geojson?: string | null
          min_exp_months?: number | null
          monthly_rate?: number | null
          owner_org_id?: string
          posted_at?: string | null
          requires_cert_types?: string[]
          role?: string
          start_date?: string
          status?: Database["public"]["Enums"]["job_status"]
          title?: string
          updated_at?: string
          vessel_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_owner_org_id_fkey"
            columns: ["owner_org_id"]
            isOneToOne: false
            referencedRelation: "owner_orgs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_vessel_id_fkey"
            columns: ["vessel_id"]
            isOneToOne: false
            referencedRelation: "vessels"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string
          crew_user_id: string
          id: string
          job_id: string
          reasons: Json
          score: number
        }
        Insert: {
          created_at?: string
          crew_user_id: string
          id?: string
          job_id: string
          reasons?: Json
          score: number
        }
        Update: {
          created_at?: string
          crew_user_id?: string
          id?: string
          job_id?: string
          reasons?: Json
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "matches_crew_user_id_fkey"
            columns: ["crew_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      owner_org_members: {
        Row: {
          created_at: string
          id: string
          org_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          org_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "owner_org_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "owner_orgs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "owner_org_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      owner_orgs: {
        Row: {
          billing_email: string | null
          created_at: string
          id: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          billing_email?: string | null
          created_at?: string
          id?: string
          name: string
          type?: string
          updated_at?: string
        }
        Update: {
          billing_email?: string | null
          created_at?: string
          id?: string
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          id: string
          org_id: string | null
          plan: Database["public"]["Enums"]["subscription_plan"]
          provider_sub_id: string | null
          renewal_date: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          org_id?: string | null
          plan?: Database["public"]["Enums"]["subscription_plan"]
          provider_sub_id?: string | null
          renewal_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string | null
          plan?: Database["public"]["Enums"]["subscription_plan"]
          provider_sub_id?: string | null
          renewal_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: true
            referencedRelation: "owner_orgs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          role: Database["public"]["Enums"]["role"]
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          role?: Database["public"]["Enums"]["role"]
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["role"]
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      verifications: {
        Row: {
          created_at: string
          id: string
          kyc_provider: string | null
          kyc_provider_id: string | null
          kyc_status: string
          last_reviewed_at: string | null
          notes: string | null
          reviewed_by: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kyc_provider?: string | null
          kyc_provider_id?: string | null
          kyc_status?: string
          last_reviewed_at?: string | null
          notes?: string | null
          reviewed_by?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kyc_provider?: string | null
          kyc_provider_id?: string | null
          kyc_status?: string
          last_reviewed_at?: string | null
          notes?: string | null
          reviewed_by?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "verifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      vessels: {
        Row: {
          build_year: number | null
          created_at: string
          flag_state: string | null
          homeport: string | null
          id: string
          length_m: number | null
          mmsi: string | null
          name: string
          notes: string | null
          owner_org_id: string
          type: string
          updated_at: string
        }
        Insert: {
          build_year?: number | null
          created_at?: string
          flag_state?: string | null
          homeport?: string | null
          id?: string
          length_m?: number | null
          mmsi?: string | null
          name: string
          notes?: string | null
          owner_org_id: string
          type: string
          updated_at?: string
        }
        Update: {
          build_year?: number | null
          created_at?: string
          flag_state?: string | null
          homeport?: string | null
          id?: string
          length_m?: number | null
          mmsi?: string | null
          name?: string
          notes?: string | null
          owner_org_id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vessels_owner_org_id_fkey"
            columns: ["owner_org_id"]
            isOneToOne: false
            referencedRelation: "owner_orgs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_owner_org: {
        Args: { p_name: string; p_type?: string }
        Returns: {
          billing_email: string | null
          created_at: string
          id: string
          name: string
          type: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "owner_orgs"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["role"]
      }
      is_org_member: { Args: { p_org: string }; Returns: boolean }
      is_owner_role: { Args: never; Returns: boolean }
    }
    Enums: {
      application_status:
        | "APPLIED"
        | "SHORTLISTED"
        | "INTERVIEW"
        | "OFFER"
        | "REJECTED"
        | "WITHDRAWN"
        | "ACCEPTED"
      contract_type: "DAY" | "SEASONAL" | "PERMANENT"
      job_status: "DRAFT" | "OPEN" | "CLOSED" | "FILLED" | "ARCHIVED"
      role: "CREW" | "OWNER" | "AGENCY" | "ADMIN"
      subscription_plan: "FREE" | "PRO" | "ELITE" | "AGENCY" | "ENTERPRISE"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      application_status: [
        "APPLIED",
        "SHORTLISTED",
        "INTERVIEW",
        "OFFER",
        "REJECTED",
        "WITHDRAWN",
        "ACCEPTED",
      ],
      contract_type: ["DAY", "SEASONAL", "PERMANENT"],
      job_status: ["DRAFT", "OPEN", "CLOSED", "FILLED", "ARCHIVED"],
      role: ["CREW", "OWNER", "AGENCY", "ADMIN"],
      subscription_plan: ["FREE", "PRO", "ELITE", "AGENCY", "ENTERPRISE"],
    },
  },
} as const

