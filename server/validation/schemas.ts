import { z } from 'zod';

export const ChatMessageSchema = z.object({
  sessionId: z.string().min(5).max(100),
  message: z.string().trim().min(1, 'Message cannot be empty').max(1000, 'Message cannot exceed 1000 characters'),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'model']),
        content: z.string().max(1000),
      })
    )
    .max(10)
    .default([]),
  turnstileToken: z.string().optional(),
  currentState: z
    .object({
      companyName: z.string().optional(),
      industry: z.string().optional(),
      contactName: z.string().optional(),
      businessEmail: z.string().optional(),
      phone: z.string().optional(),
      giftingPurpose: z.string().optional(),
      occasion: z.string().optional(),
      targetAudience: z.string().optional(),
      quantity: z.number().optional(),
      budgetPerUnit: z.number().optional(),
      customisationRequirements: z.string().optional(),
      deliveryLocations: z.string().optional(),
      requiredDeliveryDate: z.string().optional(),
      additionalRequirements: z.string().optional(),
    })
    .optional(),
});

export const GetGiftsQuerySchema = z.object({
  category: z.string().optional(),
  audience: z.string().optional(),
  occasion: z.string().optional(),
  offeringType: z.enum(['product', 'kit', 'hamper', 'service', 'category', 'idea']).optional(),
  maxPrice: z.coerce.number().positive().optional(),
  limit: z.coerce.number().int().min(1).max(20).default(6),
  search: z.string().optional(),
});

export const EnquirySubmissionSchema = z.object({
  sessionId: z.string().min(5),
  companyName: z.string().trim().min(2, 'Company name is required').max(150),
  industry: z.string().trim().max(100).optional().nullable(),
  contactName: z.string().trim().min(2, 'Contact person name is required').max(100),
  businessEmail: z.string().trim().email('Valid business email is required'),
  phone: z.string().trim().min(7, 'Valid contact number is required').max(25),
  giftingPurpose: z.string().trim().max(200).optional().nullable(),
  occasion: z.string().trim().max(100).optional().nullable(),
  targetAudience: z.string().trim().max(150).optional().nullable(),
  quantity: z.number().int().positive().optional().nullable(),
  budgetPerUnitPaise: z.number().int().nonnegative().optional().nullable(),
  totalBudgetPaise: z.number().int().nonnegative().optional().nullable(),
  customisationRequirements: z.string().trim().max(500).optional().nullable(),
  deliveryLocations: z.string().trim().max(200).optional().nullable(),
  requiredDeliveryDate: z.string().trim().max(100).optional().nullable(),
  additionalRequirements: z.string().trim().max(1000).optional().nullable(),
  conversationSummary: z.string().trim().min(5, 'Conversation summary is required'),
  consentToContact: z.literal(true, {
    message: 'Consent to contact is required to submit an enquiry',
  }),
  turnstileToken: z.string().optional(),
});

export const WhatsAppDraftSchema = z.object({
  companyName: z.string().trim().optional(),
  contactName: z.string().trim().optional(),
  requirement: z.string().trim().optional(),
  occasion: z.string().trim().optional(),
  targetAudience: z.string().trim().optional(),
  quantity: z.union([z.number(), z.string()]).optional(),
  budgetPerUnit: z.union([z.number(), z.string()]).optional(),
  customisation: z.string().trim().optional(),
  deliveryLocation: z.string().trim().optional(),
  requiredDeliveryDate: z.string().trim().optional(),
  additionalNotes: z.string().trim().optional(),
});

export type ChatMessageInput = z.infer<typeof ChatMessageSchema>;
export type GetGiftsQueryInput = z.infer<typeof GetGiftsQuerySchema>;
export type EnquirySubmissionInput = z.infer<typeof EnquirySubmissionSchema>;
export type WhatsAppDraftInput = z.infer<typeof WhatsAppDraftSchema>;
