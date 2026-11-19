export type OfferingType = 'product' | 'kit' | 'hamper' | 'service' | 'category' | 'idea';
export type AvailabilityStatus = 'in_stock' | 'made_to_order' | 'quote_required' | 'seasonal';
export type EnquiryStatus = 'new' | 'contacted' | 'quoted' | 'in_progress' | 'closed';

export interface GiftOffering {
  id: string;
  name: string;
  description: string;
  offering_type: OfferingType;
  category: string;
  target_audience_tags: string[];
  occasion_tags: string[];
  industry_tags: string[];
  customisation_options: string[];
  price_min_paise: number | null;
  price_max_paise: number | null;
  price_is_estimate: boolean;
  minimum_quantity: number | null;
  lead_time_days: string | null;
  image_url: string | null;
  product_url: string | null;
  availability_status: AvailabilityStatus;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BusinessEnquiry {
  id: string;
  session_id: string;
  company_name: string;
  industry?: string | null;
  contact_name: string;
  business_email: string;
  phone: string;
  gifting_purpose?: string | null;
  occasion?: string | null;
  target_audience?: string | null;
  quantity?: number | null;
  budget_per_unit_paise?: number | null;
  total_budget_paise?: number | null;
  customisation_requirements?: string | null;
  delivery_locations?: string | null;
  required_delivery_date?: string | null;
  additional_requirements?: string | null;
  conversation_summary: string;
  consent_to_contact: boolean;
  status: EnquiryStatus;
  created_at: string;
}

export interface ChatSession {
  id: string;
  ip_hash: string;
  message_count: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  expires_at: string;
}

export interface DiscoveredEnquiryState {
  companyName?: string;
  industry?: string;
  contactName?: string;
  businessEmail?: string;
  phone?: string;
  giftingPurpose?: string;
  occasion?: string;
  targetAudience?: string;
  quantity?: number;
  budgetPerUnit?: number;
  customisationRequirements?: string;
  deliveryLocations?: string;
  requiredDeliveryDate?: string;
  additionalRequirements?: string;
}
