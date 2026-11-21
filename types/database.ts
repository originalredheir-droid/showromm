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

export interface BusinessProfileRow {
  [key: string]: unknown;
  id: boolean;
  company_name: string;
  brand_name: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  logo_path: string;
  updated_at: string;
  updated_by: string | null;
}

export interface BusinessProfileSnapshot {
  company_name: string;
  brand_name: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  logo_path: string;
}

export interface ProposalRow {
  [key: string]: unknown;
  id: string;
  proposal_number: string;
  sequence_year: number;
  sequence_number: number;
  proposal_date: string;
  valid_until: string | null;
  client_name: string;
  client_company: string;
  client_email: string;
  client_phone: string;
  project_name: string;
  project_brief: string;
  notes: string;
  items: Array<{
    catalogTitle: string;
    title: string;
    description: string;
    image: string;
    estimatedPriceINR: number | null;
    devHours: number | null;
  }>;
  business_profile: BusinessProfileSnapshot;
  total_estimated_inr: number;
  total_estimated_hours: number;
  created_by: string;
  created_at: string;
}

export interface InvoiceItem {
  id: string;
  catalogTitle: string;
  title: string;
  description: string;
  image: string;
  amount: number;
}

export interface InvoiceRow {
  [key: string]: unknown;
  id: string;
  proposal_id: string;
  invoice_number: string | null;
  sequence_year: number | null;
  sequence_number: number | null;
  status: 'draft' | 'issued';
  issue_date: string | null;
  due_date: string | null;
  client_name: string;
  client_company: string;
  client_email: string;
  client_phone: string;
  project_name: string;
  items: InvoiceItem[];
  adjustment_amount: number;
  adjustment_note: string;
  business_profile: BusinessProfileSnapshot;
  total_amount: number;
  created_by: string;
  created_at: string;
  issued_at: string | null;
}

export interface InvoicePaymentRow {
  [key: string]: unknown;
  id: string;
  invoice_id: string;
  receipt_number: string;
  sequence_year: number;
  sequence_number: number;
  payment_date: string;
  amount: number;
  method: string;
  reference: string;
  memo: string;
  created_by: string;
  created_at: string;
}

type CategoryInsert = Omit<CategoryRow, 'id' | 'created_at' | 'updated_at'> &
  Partial<Pick<CategoryRow, 'id' | 'created_at' | 'updated_at'>>;
type DesignInsert = Omit<DesignRow, 'id' | 'created_at' | 'updated_at'> &
  Partial<Pick<DesignRow, 'id' | 'created_at' | 'updated_at'>>;
type BusinessProfileInsert = Omit<BusinessProfileRow, 'updated_at' | 'updated_by'> &
  Partial<Pick<BusinessProfileRow, 'updated_at' | 'updated_by'>>;
type ProposalInsert = Omit<ProposalRow, 'id' | 'created_at'> &
  Partial<Pick<ProposalRow, 'id' | 'created_at'>>;
type InvoiceInsert = Omit<InvoiceRow, 'id' | 'created_at' | 'issued_at'> &
  Partial<Pick<InvoiceRow, 'id' | 'created_at' | 'issued_at'>>;
type InvoicePaymentInsert = Omit<InvoicePaymentRow, 'id' | 'created_at'> &
  Partial<Pick<InvoicePaymentRow, 'id' | 'created_at'>>;

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
      business_profiles: Table<BusinessProfileRow, BusinessProfileInsert, Partial<BusinessProfileInsert>>;
      proposals: Table<ProposalRow, ProposalInsert, Partial<ProposalInsert>>;
      invoices: Table<InvoiceRow, InvoiceInsert, Partial<InvoiceInsert>>;
      invoice_payments: Table<InvoicePaymentRow, InvoicePaymentInsert, Partial<InvoicePaymentInsert>>;
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<never, never>; Returns: boolean };
      get_catalog_storage_usage: {
        Args: Record<never, never>;
        Returns: Array<{
          total_storage_bytes: number;
          total_storage_objects: number;
          catalog_asset_bytes: number;
          catalog_asset_objects: number;
          referenced_catalog_bytes: number;
          referenced_catalog_objects: number;
          published_catalog_count: number;
          quota_bytes: number | null;
        }>;
      };
      set_catalog_storage_quota: {
        Args: { p_quota_bytes: number | null };
        Returns: undefined;
      };
      create_proposal: {
        Args: { p_payload: Record<string, unknown> };
        Returns: Array<{ proposal_id: string; proposal_number: string }>;
      };
      create_invoice_draft: {
        Args: { p_proposal_id: string };
        Returns: string;
      };
      update_invoice_draft: {
        Args: { p_invoice_id: string; p_payload: Record<string, unknown> };
        Returns: undefined;
      };
      delete_invoice_draft: {
        Args: { p_invoice_id: string };
        Returns: undefined;
      };
      issue_invoice: {
        Args: { p_invoice_id: string; p_issue_date: string };
        Returns: Array<{ invoice_number: string }>;
      };
      record_invoice_payment: {
        Args: { p_invoice_id: string; p_payload: Record<string, unknown> };
        Returns: Array<{ payment_id: string; receipt_number: string }>;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
