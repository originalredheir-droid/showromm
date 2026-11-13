import type {
  DesignCommercial,
  DesignFeature,
  DesignTechnicalSpecs,
  ScreenPreview,
} from '@/types';

type Table<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export interface CategoryRow {
  [key: string]: unknown;
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_name: string;
  featured_image: string;
  accent_badge: string | null;
  tags: string[];
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DesignRow {
  [key: string]: unknown;
  id: string;
  slug: string;
  title: string;
  category_id: string;
  concept_type: 'concept' | 'page' | 'module' | 'section';
  concept_type_label: string;
  short_description: string;
  full_description: string;
  visual_preview_image: string;
  screen_previews: ScreenPreview[];
  features: DesignFeature[];
  technical_specs: DesignTechnicalSpecs;
  commercial: DesignCommercial;
  tags: string[];
  featured: boolean;
  popular: boolean;
  new_addition: boolean;
  functional_notice: string;
  related_ids: string[];
  status: 'draft' | 'published' | 'archived';
  sort_order: number;
  created_at: string;
  updated_at: string;
}

type CategoryInsert = Omit<CategoryRow, 'id' | 'created_at' | 'updated_at'> &
  Partial<Pick<CategoryRow, 'id' | 'created_at' | 'updated_at'>>;
type DesignInsert = Omit<DesignRow, 'id' | 'created_at' | 'updated_at'> &
  Partial<Pick<DesignRow, 'id' | 'created_at' | 'updated_at'>>;

export interface Database {
  public: {
    Tables: {
      admin_users: Table<
        { user_id: string; created_at: string },
        { user_id: string; created_at?: string },
        { user_id?: string; created_at?: string }
      >;
      categories: Table<CategoryRow, CategoryInsert, Partial<CategoryInsert>>;
      designs: Table<DesignRow, DesignInsert, Partial<DesignInsert>>;
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<never, never>; Returns: boolean };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
