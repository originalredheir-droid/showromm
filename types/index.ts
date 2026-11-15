export type ConceptType = 'concept' | 'page' | 'module' | 'section';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  moduleCount: number;
  portalCount: number;
  featuredImage: string;
  accentBadge?: string;
  tags: string[];
}

export interface ScreenPreview {
  id: string;
  title: string;
  viewport: 'desktop' | 'tablet' | 'mobile';
  image: string;
  description: string;
  sortOrder?: number;
  estimatedPriceINR?: number;
  devHours?: number;
}

export interface DesignFeature {
  title: string;
  description: string;
  status?: string;
  isCore?: boolean;
}

export interface DesignTechnicalSpecs {
  devHours: number;
  techStack: string[];
  responsiveBreakpoints: string[];
  deliverables: string[];
  architectureNotes?: string;
}

export interface DesignCommercial {
  estimatedBaseINR: number;
  licenseType: string;
  warrantyDays: number;
}

export interface Design {
  id: string;
  slug: string;
  title: string;
  categoryId: string;
  categoryName: string;
  conceptType: ConceptType;
  conceptTypeLabel: string;
  shortDescription: string;
  fullDescription: string;
  visualPreviewImage: string;
  screenPreviews: ScreenPreview[];
  features: DesignFeature[];
  technicalSpecs: DesignTechnicalSpecs;
  commercial: DesignCommercial;
  tags: string[];
  featured?: boolean;
  popular?: boolean;
  newAddition?: boolean;
  functionalNotice: string;
  relatedIds: string[];
  status?: 'draft' | 'published' | 'archived';
}

export interface CartItem {
  id: string;
  design: Design;
  screen: ScreenPreview;
  addedAt: number;
  notes?: string;
  legacySelection?: boolean;
}

export interface PresenterSettings {
  showPricing: boolean;
  showInternalDetails: boolean;
  pitchMode: boolean;
}
