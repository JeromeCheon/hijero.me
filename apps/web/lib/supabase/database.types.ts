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
      post_views: {
        Row: {
          slug: string
          view_count: number
          updated_at: string
        }
        Insert: {
          slug: string
          view_count?: number
          updated_at?: string
        }
        Update: {
          slug?: string
          view_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      post_view_logs: {
        Row: {
          id: string
          slug: string
          viewer_fingerprint: string
          viewed_at: string
        }
        Insert: {
          id?: string
          slug: string
          viewer_fingerprint: string
          viewed_at?: string
        }
        Update: {
          id?: string
          slug?: string
          viewer_fingerprint?: string
          viewed_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      increment_post_view: {
        Args: { p_slug: string; p_viewer_fingerprint: string }
        Returns: boolean
      }
      get_popular_posts_30d: {
        Args: { limit_count?: number }
        Returns: { slug: string; view_count: number }[]
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
