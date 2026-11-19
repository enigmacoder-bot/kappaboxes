import test from 'node:test';
import assert from 'node:assert/strict';
import { processB2BChat, extractEnquiryDetails } from '../server/ai/gemini';
import { offeringsRepo } from '../server/db/client';

test('AI Quality: Rejects consumer/personal gift queries and clarifies B2B focus', async () => {
  const personalQueries = [
    'I want to buy a birthday gift for my boyfriend',
    'Gift ideas for my mom on mothers day',
    'What should I buy for my wife on our anniversary?',
  ];

  for (const q of personalQueries) {
    const res = await processB2BChat(q, []);
    assert.equal(
      res.recommendations.length,
      0,
      `Should not return catalogue products for personal query: "${q}"`
    );
    assert.ok(
      res.message.toLowerCase().includes('corporate') || res.message.toLowerCase().includes('business'),
      `Should state B2B corporate focus for query: "${q}"`
    );
    assert.ok(
      !res.message.toLowerCase().includes('for your boyfriend') &&
        !res.message.toLowerCase().includes('for your wife'),
      'Should not entertain personal gift consultation'
    );
  }
});

test('AI Quality: Does not fabricate unconfirmed prices or nonexistent products', async () => {
  const res = await processB2BChat('Client appreciation gifts', []);
  for (const rec of res.recommendations) {
    const dbItem = await offeringsRepo.getOfferingById(rec.id);
    assert.ok(dbItem, `Recommended item ${rec.id} must exist in the database`);
    assert.equal(rec.name, dbItem?.name, 'Product name must match database record');
    assert.equal(rec.price_min_paise, dbItem?.price_min_paise, 'Prices must not be fabricated');
  }
});

test('AI Quality: Distinguishes confirmed products from illustrative ideas', async () => {
  const offerings = await offeringsRepo.getAllActiveOfferings();
  const ideas = offerings.filter((o) => o.offering_type === 'idea');
  const kits = offerings.filter((o) => o.offering_type === 'kit');

  assert.ok(ideas.length > 0, 'Seed catalogue must contain illustrative ideas');
  assert.ok(kits.length > 0, 'Seed catalogue must contain confirmed kits');

  for (const idea of ideas) {
    assert.equal(
      idea.availability_status,
      'quote_required',
      'Illustrative ideas must require sales team confirmation'
    );
  }
});

test('AI Quality: Progressive single-question follow-ups', async () => {
  // Turn 1: Only purpose provided -> Should ask for quantity
  const step1 = await processB2BChat('We need welcome kits for onboarding', []);
  assert.ok(
    step1.message.includes('?') || step1.suggestedReplies.length > 0,
    'Must ask a follow-up question or offer replies'
  );

  // Turn 2: Quantity provided -> Should ask for budget
  const step2 = await processB2BChat('We have about 300 employees joining this quarter', [], {
    occasion: 'Employee Onboarding',
    targetAudience: 'Employees',
    quantity: 300,
  });
  assert.ok(
    step2.message.toLowerCase().includes('budget') || step2.suggestedReplies.some((r) => r.includes('₹')),
    'Should ask for budget once quantity is known'
  );
});

test('AI Quality: Handles vague corporate requirements constructively', async () => {
  const vague = await processB2BChat('We want some nice corporate gifts for our company', []);
  assert.ok(vague.message.length > 20);
  assert.ok(vague.suggestedReplies.length >= 2, 'Should offer clear starting options');
});

test('AI Quality: Handles requests outside company services cleanly', async () => {
  const unrelated = await processB2BChat('Can you deliver 50 pepperoni pizzas to our office lunch?', []);
  assert.ok(
    unrelated.message.toLowerCase().includes('corporate gifting') ||
      unrelated.message.toLowerCase().includes('welcome kits') ||
      unrelated.message.toLowerCase().includes('meridian'),
    'Should guide the visitor back to corporate packaging and gifting solutions'
  );
});

test('AI Quality: Correctly extracts and summarizes multi-turn business requirements', () => {
  const history = [
    { role: 'user', content: 'We need Diwali hampers for our senior clients' },
    { role: 'assistant', content: 'Certainly! How many clients are you planning for?' },
    { role: 'user', content: 'About 150 clients' },
    { role: 'assistant', content: 'What budget are you considering per hamper?' },
    { role: 'user', content: 'Around ₹2,500 each' },
  ];

  const state = extractEnquiryDetails('Can you deliver to Bengaluru and Mumbai?', history);
  assert.equal(state.occasion, 'Diwali Festive Gifting');
  assert.equal(state.quantity, 150);
  assert.equal(state.budgetPerUnit, 2500);
  assert.ok(state.deliveryLocations?.toLowerCase().includes('bengaluru'));
});
