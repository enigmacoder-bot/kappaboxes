import { Router, type Request, type Response } from 'express';
import { processB2BChat } from '../ai/gemini';
import { config } from '../config';
import { enquiriesRepo, offeringsRepo } from '../db/client';
import {
  ChatMessageSchema,
  EnquirySubmissionSchema,
  GetGiftsQuerySchema,
  WhatsAppDraftSchema,
} from '../validation/schemas';
import { sessionRateLimiter, verifyTurnstileToken } from '../middleware/security';

export const apiRouter = Router();

// 1. Health check
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Meridian Corporate Gifting Assistant API',
    model: config.geminiModel,
    aiConfigured: Boolean(config.geminiApiKey),
    supabaseConfigured: Boolean(config.supabaseUrl && config.supabaseKey),
    timestamp: new Date().toISOString(),
  });
});

// 2. Chat endpoint
apiRouter.post('/chat', sessionRateLimiter, async (req: Request, res: Response) => {
  try {
    const parseResult = ChatMessageSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Invalid request payload',
        details: parseResult.error.flatten(),
      });
    }

    const { sessionId, message, history, turnstileToken, currentState } = parseResult.data;

    // Turnstile bot verification check if token is provided or enforced
    if (turnstileToken && config.turnstileSecretKey) {
      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const valid = await verifyTurnstileToken(turnstileToken, clientIp);
      if (!valid) {
        return res.status(403).json({ error: 'Security verification failed. Please try again.' });
      }
    }

    const chatResponse = await processB2BChat(message, history, currentState);
    return res.json({
      success: true,
      sessionId,
      ...chatResponse,
    });
  } catch (error: any) {
    console.error('[API /api/chat error]:', error);
    return res.status(500).json({
      error: 'An internal error occurred while processing your request. Please try again.',
    });
  }
});

// 3. Gifts catalog endpoint
apiRouter.get('/gifts', async (req: Request, res: Response) => {
  try {
    const parseResult = GetGiftsQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Invalid query parameters',
        details: parseResult.error.flatten(),
      });
    }

    const { category, audience, occasion, offeringType, maxPrice, limit, search } = parseResult.data;
    const offerings = await offeringsRepo.findOfferings({
      category,
      audience,
      occasion,
      offeringType,
      maxPricePaise: maxPrice ? maxPrice * 100 : undefined,
      limit,
      searchTerm: search,
    });

    return res.json({
      success: true,
      count: offerings.length,
      data: offerings,
    });
  } catch (error: any) {
    console.error('[API /api/gifts error]:', error);
    return res.status(500).json({ error: 'Failed to retrieve gifting offerings.' });
  }
});

// 4. WhatsApp draft generation endpoint
apiRouter.post('/whatsapp-draft', (req: Request, res: Response) => {
  try {
    const parseResult = WhatsAppDraftSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Invalid enquiry payload',
        details: parseResult.error.flatten(),
      });
    }

    const data = parseResult.data;
    const lines: string[] = [
      `Hello ${config.companyName}! I would like to enquire about corporate gifting solutions.`,
      '',
    ];

    if (data.companyName) lines.push(`*Company:* ${data.companyName}`);
    if (data.contactName) lines.push(`*Contact Person:* ${data.contactName}`);
    if (data.requirement) lines.push(`*Requirement:* ${data.requirement}`);
    if (data.occasion) lines.push(`*Occasion:* ${data.occasion}`);
    if (data.targetAudience) lines.push(`*Target Audience:* ${data.targetAudience}`);
    if (data.quantity) lines.push(`*Estimated Quantity:* ${data.quantity} units`);
    if (data.budgetPerUnit) {
      const budgetNum = typeof data.budgetPerUnit === 'number' ? data.budgetPerUnit : parseInt(data.budgetPerUnit, 10);
      lines.push(`*Target Budget:* ₹${budgetNum ? budgetNum.toLocaleString('en-IN') : data.budgetPerUnit} per unit`);
    }
    if (data.customisation) lines.push(`*Customisation:* ${data.customisation}`);
    if (data.deliveryLocation) lines.push(`*Delivery Location:* ${data.deliveryLocation}`);
    if (data.requiredDeliveryDate) lines.push(`*Required By:* ${data.requiredDeliveryDate}`);
    if (data.additionalNotes) lines.push(`*Additional Notes:* ${data.additionalNotes}`);

    lines.push('');
    lines.push('Please share suitable options, available customisations, and a formal quote.');
    lines.push('');
    lines.push('Thank you.');

    const formattedText = lines.join('\n');
    const encodedText = encodeURIComponent(formattedText);
    const whatsappUrl = `https://wa.me/${config.companyWhatsAppNumber}?text=${encodedText}`;

    return res.json({
      success: true,
      formattedText,
      whatsappUrl,
      companyNumber: config.companyWhatsAppNumber,
    });
  } catch (error: any) {
    console.error('[API /api/whatsapp-draft error]:', error);
    return res.status(500).json({ error: 'Failed to generate WhatsApp draft.' });
  }
});

// 5. Submit structured business enquiry
apiRouter.post('/enquiries', async (req: Request, res: Response) => {
  try {
    const parseResult = EnquirySubmissionSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Invalid enquiry submission',
        details: parseResult.error.flatten(),
      });
    }

    const data = parseResult.data;

    // Optional turnstile check
    if (data.turnstileToken && config.turnstileSecretKey) {
      const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const valid = await verifyTurnstileToken(data.turnstileToken, clientIp);
      if (!valid) {
        return res.status(403).json({ error: 'Security verification failed. Please try again.' });
      }
    }

    const createdEnquiry = await enquiriesRepo.createEnquiry({
      session_id: data.sessionId,
      company_name: data.companyName,
      industry: data.industry || null,
      contact_name: data.contactName,
      business_email: data.businessEmail,
      phone: data.phone,
      gifting_purpose: data.giftingPurpose || null,
      occasion: data.occasion || null,
      target_audience: data.targetAudience || null,
      quantity: data.quantity || null,
      budget_per_unit_paise: data.budgetPerUnitPaise || null,
      total_budget_paise: data.totalBudgetPaise || null,
      customisation_requirements: data.customisationRequirements || null,
      delivery_locations: data.deliveryLocations || null,
      required_delivery_date: data.requiredDeliveryDate || null,
      additional_requirements: data.additionalRequirements || null,
      conversation_summary: data.conversationSummary,
      consent_to_contact: Boolean(data.consentToContact),
    });

    return res.status(201).json({
      success: true,
      message: 'Your corporate gifting enquiry has been submitted to our sales team.',
      referenceId: createdEnquiry.id,
      lead: {
        id: createdEnquiry.id,
        companyName: createdEnquiry.company_name,
        contactName: createdEnquiry.contact_name,
        email: createdEnquiry.business_email,
        createdAt: createdEnquiry.created_at,
      },
    });
  } catch (error: any) {
    console.error('[API /api/enquiries error]:', error);
    return res.status(500).json({ error: 'Failed to submit enquiry. Please try again or use WhatsApp.' });
  }
});
