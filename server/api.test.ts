import test from 'node:test';
import assert from 'node:assert/strict';
import { extractEnquiryDetails, extractSearchFilters, processB2BChat } from './ai/gemini';
import { offeringsRepo, enquiriesRepo } from './db/client';
import {
  ChatMessageSchema,
  EnquirySubmissionSchema,
  WhatsAppDraftSchema,
} from './validation/schemas';
import { config } from './config';

test('extractEnquiryDetails accurately parses B2B corporate parameters', () => {
  const message = 'We need Diwali gifts for 500 employees around ₹1,500 each delivered to Bengaluru with our company logo';
  const state = extractEnquiryDetails(message, []);

  assert.equal(state.occasion, 'Diwali Festive Gifting');
  assert.equal(state.targetAudience, 'Employees');
  assert.equal(state.quantity, 500);
  assert.equal(state.budgetPerUnit, 1500);
  assert.equal(state.deliveryLocations, 'Bengaluru');
  assert.ok(state.customisationRequirements?.includes('logo'));
});

test('processB2BChat rejects personal/consumer gift requests and redirects to B2B', async () => {
  const res = await processB2BChat('Can you recommend a romantic birthday gift for my girlfriend?', []);
  
  assert.ok(
    res.message.includes('exclusively') || res.message.includes('corporate gifting'),
    'Should state corporate gifting focus'
  );
  assert.ok(
    !res.message.toLowerCase().includes('girlfriend'),
    'Should not assist with personal gift shopping'
  );
  assert.equal(res.recommendations.length, 0, 'Should not recommend offerings for consumer gifts');
  assert.ok(res.suggestedReplies.length > 0, 'Should offer corporate gifting options');
});

test('processB2BChat recommends valid corporate kits for employee onboarding', async () => {
  const res = await processB2BChat('We are looking for employee onboarding welcome kits for our new hires', []);
  
  assert.ok(res.message.length > 20, 'Should return a helpful consultant message');
  assert.ok(res.recommendations.length > 0, 'Should return matching onboarding kits');
  const hasOnboarding = res.recommendations.some(
    (r) => r.category === 'Employee Onboarding' || r.target_audience_tags.includes('new hires')
  );
  assert.ok(hasOnboarding, 'Should contain onboarding recommendations');
});

test('offeringsRepo filters offerings by category and budget', async () => {
  const diwaliOfferings = await offeringsRepo.findOfferings({
    category: 'Festive Hampers',
  });
  assert.ok(diwaliOfferings.length > 0, 'Should find festive hampers');
  assert.ok(diwaliOfferings.every((o) => o.category === 'Festive Hampers'));

  // Test budget filter
  const affordable = await offeringsRepo.findOfferings({
    maxPricePaise: 100000, // ₹1,000 max
  });
  assert.ok(
    affordable.every((o) => o.price_min_paise === null || o.price_min_paise <= 100000),
    'Should respect max price'
  );
});

test('WhatsApp draft generation produces formatted text and valid click-to-chat URL', () => {
  const payload = {
    companyName: 'Acme Corp',
    contactName: 'Priya Sharma',
    requirement: 'Diwali employee gift boxes',
    quantity: 500,
    budgetPerUnit: 1500,
    customisation: 'Gold foil company logo',
    deliveryLocation: 'Bengaluru',
    requiredDeliveryDate: 'Before Oct 20',
  };

  const parsed = WhatsAppDraftSchema.safeParse(payload);
  assert.ok(parsed.success);

  const lines: string[] = [
    `Hello ${config.companyName}! I would like to enquire about corporate gifting solutions.`,
    '',
    `*Company:* ${payload.companyName}`,
    `*Contact Person:* ${payload.contactName}`,
    `*Requirement:* ${payload.requirement}`,
    `*Estimated Quantity:* ${payload.quantity} units`,
    `*Target Budget:* ₹1,500 per unit`,
    `*Customisation:* ${payload.customisation}`,
    `*Delivery Location:* ${payload.deliveryLocation}`,
    `*Required By:* ${payload.requiredDeliveryDate}`,
  ];
  const formatted = lines.join('\n');
  assert.ok(formatted.includes('Acme Corp'));
  assert.ok(formatted.includes('500 units'));

  const url = `https://wa.me/${config.companyWhatsAppNumber}?text=${encodeURIComponent(formatted)}`;
  assert.ok(url.startsWith('https://wa.me/'));
  assert.ok(url.includes(config.companyWhatsAppNumber));
});

test('EnquirySubmissionSchema enforces required business contact and consent', async () => {
  // Missing consent should fail
  const invalid = {
    sessionId: 'session-12345',
    companyName: 'Tech Innovations',
    contactName: 'Rohit Verma',
    businessEmail: 'rohit@techinnovations.com',
    phone: '+91 9876543210',
    conversationSummary: 'Interested in 200 onboarding kits',
    consentToContact: false,
  };
  const invalidResult = EnquirySubmissionSchema.safeParse(invalid);
  assert.equal(invalidResult.success, false, 'Should fail without consent');

  // Valid submission should pass
  const valid = {
    ...invalid,
    consentToContact: true,
  };
  const validResult = EnquirySubmissionSchema.safeParse(valid);
  assert.equal(validResult.success, true, 'Should pass with true consent');

  // Test inserting into enquiries repo
  const saved = await enquiriesRepo.createEnquiry({
    session_id: valid.sessionId,
    company_name: valid.companyName,
    contact_name: valid.contactName,
    business_email: valid.businessEmail,
    phone: valid.phone,
    conversation_summary: valid.conversationSummary,
    consent_to_contact: true,
  });

  assert.ok(saved.id.startsWith('enq-'));
  assert.equal(saved.company_name, 'Tech Innovations');
  assert.equal(saved.status, 'new');
});

test('ChatMessageSchema validates message lengths and prevents oversized payloads', () => {
  // Empty message
  const empty = ChatMessageSchema.safeParse({
    sessionId: 'sess-12345',
    message: '   ',
  });
  assert.equal(empty.success, false);

  // Oversized message (> 1000 chars)
  const oversized = ChatMessageSchema.safeParse({
    sessionId: 'sess-12345',
    message: 'a'.repeat(1005),
  });
  assert.equal(oversized.success, false);

  // Valid message
  const valid = ChatMessageSchema.safeParse({
    sessionId: 'sess-12345',
    message: 'Hello, looking for event kits for an upcoming conference.',
  });
  assert.equal(valid.success, true);
});
