export type OfferingType = 'product' | 'kit' | 'hamper' | 'service' | 'category' | 'idea';
export type AvailabilityStatus = 'in_stock' | 'made_to_order' | 'quote_required' | 'seasonal';

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

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendations?: GiftOffering[];
  suggestedReplies?: string[];
  isError?: boolean;
}

export interface WhatsAppDraftResponse {
  success: boolean;
  formattedText: string;
  whatsappUrl: string;
  companyNumber: string;
}
