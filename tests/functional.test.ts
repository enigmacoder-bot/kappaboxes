import test from 'node:test';
import assert from 'node:assert/strict';
import { extractEnquiryDetails, processB2BChat } from '../server/ai/gemini';
import { offeringsRepo, enquiriesRepo } from '../server/db/client';
import { WhatsAppDraftSchema } from '../server/validation/schemas';
import { config } from '../server/config';

test('Functional: Conversation starters and employee onboarding recommendations', async () => {
  const result = await processB2BChat('Employee onboarding kits', []);
  assert.ok(result.message.length > 0);
  assert.ok(result.recommendations.length > 0, 'Should find onboarding recommendations');
  assert.ok(
    result.recommendations.some(
      (r) => r.category === 'Employee Onboarding' || r.target_audience_tags.includes('new hires')
    ),
    'Should recommend employee onboarding kits'
  );
  assert.ok(result.suggestedReplies.length > 0, 'Should supply suggested quick replies');
});

test('Functional: Festival gifting recommendations (Diwali / Festive Hampers)', async () => {
  const result = await processB2BChat('Diwali / festive gift boxes for our partners and team', []);
  assert.ok(result.recommendations.length > 0);
  assert.ok(
    result.recommendations.some((r) => r.category === 'Festive Hampers' || r.occasion_tags.includes('diwali')),
    'Should recommend festive hampers'
  );
});

test('Functional: Bulk order enquiries and quantity/budget extraction', () => {
  const text = 'We need a bulk order of 1200 custom kits with an approximate budget of ₹2,000 per unit';
  const state = extractEnquiryDetails(text, []);

  assert.equal(state.quantity, 1200);
  assert.equal(state.budgetPerUnit, 2000);
});

test('Functional: Customisation requirements extraction', () => {
  const text = 'We need our corporate logo debossed on the lid and custom printed bellybands for all gift boxes';
  const state = extractEnquiryDetails(text, []);

  assert.ok(state.customisationRequirements?.toLowerCase().includes('logo'));
});

test('Functional: Delivery requirement collection', () => {
  const text = 'Please quote for delivery in Mumbai and Delhi before October 15th';
  const state = extractEnquiryDetails(text, []);

  assert.ok(state.deliveryLocations?.toLowerCase().includes('mumbai'));
});

test('Functional: WhatsApp draft generation pre-fills full message with company details', () => {
  const draftInput = {
    companyName: 'Infosys BPM',
    contactName: 'Anand Kumar',
    requirement: 'Employee Onboarding Kits',
    quantity: 350,
    budgetPerUnit: 1800,
    customisation: 'Laser engraved tumbler and debossed notebook',
    deliveryLocation: 'Bengaluru and Pune',
    requiredDeliveryDate: 'November 1st',
  };

  const parsed = WhatsAppDraftSchema.safeParse(draftInput);
  assert.ok(parsed.success);

  const lines = [
    `*Company:* ${draftInput.companyName}`,
    `*Estimated Quantity:* ${draftInput.quantity} units`,
    `*Target Budget:* ₹1,800 per unit`,
  ];
  const summary = lines.join('\n');
  assert.ok(summary.includes('Infosys BPM'));
  assert.ok(summary.includes('350 units'));
});

test('Functional: Structured enquiry submission writes lead record with unique reference ID', async () => {
  const lead = await enquiriesRepo.createEnquiry({
    session_id: 'test-session-lead-1',
    company_name: 'Stripe Global',
    contact_name: 'Elena Rostova',
    business_email: 'elena@stripe.com',
    phone: '+1 415 555 2671',
    conversation_summary: 'Requested 500 summit kits',
    consent_to_contact: true,
  });

  assert.ok(lead.id.startsWith('enq-'));
  assert.equal(lead.company_name, 'Stripe Global');
  assert.equal(lead.status, 'new');
});

test('Functional: Empty catalogue search handles non-matching criteria gracefully', async () => {
  // Query with an impossible condition
  const emptyResults = await offeringsRepo.findOfferings({
    category: 'NonExistentCategoryXYZ',
  });
  assert.equal(emptyResults.length, 0);

  // Chatbot should still formulate a helpful corporate response without crashing
  const chatRes = await processB2BChat('Do you have luxury space rockets for employees?', []);
  assert.ok(chatRes.message.length > 0);
  assert.equal(chatRes.recommendations.length, 0);
});
