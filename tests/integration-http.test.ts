import test from 'node:test';
import assert from 'node:assert/strict';
import type { Server } from 'node:http';
import { app } from '../server/index';

let server: Server;
let baseUrl: string;

test.before(() => {
  return new Promise<void>((resolve) => {
    // Listen on a random free ephemeral port (0)
    server = app.listen(0, '127.0.0.1', () => {
      const addr = server.address() as { port: number; address: string };
      baseUrl = `http://127.0.0.1:${addr.port}`;
      resolve();
    });
  });
});

test.after(() => {
  return new Promise<void>((resolve) => {
    server.close(() => resolve());
  });
});

test('HTTP GET /api/health returns operational status', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const data = (await res.json()) as any;
  assert.equal(data.status, 'ok');
  assert.ok(data.service);
});

test('HTTP GET /api/gifts returns active offerings', async () => {
  const res = await fetch(`${baseUrl}/api/gifts?limit=5`);
  assert.equal(res.status, 200);
  const data = (await res.json()) as any;
  assert.equal(data.success, true);
  assert.ok(Array.isArray(data.data));
  assert.ok(data.data.length > 0);
});

test('HTTP POST /api/chat processes message and returns structured B2B response', async () => {
  const res = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'test-http-session-123',
      message: 'Looking for Diwali festive hampers for 300 employees',
      history: [],
    }),
  });

  assert.equal(res.status, 200);
  const data = (await res.json()) as any;
  assert.equal(data.success, true);
  assert.ok(data.message.length > 0);
  assert.ok(Array.isArray(data.recommendations));
  assert.ok(Array.isArray(data.suggestedReplies));
  assert.equal(data.enquiryState.occasion, 'Diwali Festive Gifting');
});

test('HTTP POST /api/whatsapp-draft produces prefilled WhatsApp link', async () => {
  const res = await fetch(`${baseUrl}/api/whatsapp-draft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      companyName: 'Acme Technologies',
      contactName: 'Rohit Sharma',
      requirement: 'Diwali Hampers',
      quantity: 500,
      budgetPerUnit: 1500,
    }),
  });

  assert.equal(res.status, 200);
  const data = (await res.json()) as any;
  assert.equal(data.success, true);
  assert.ok(data.whatsappUrl.startsWith('https://wa.me/'));
  assert.ok(data.formattedText.includes('Acme Technologies'));
});

test('HTTP POST /api/enquiries captures business lead with reference ID', async () => {
  const res = await fetch(`${baseUrl}/api/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'sess-http-lead-999',
      companyName: 'Zomato Enterprise',
      contactName: 'Rahul Sen',
      businessEmail: 'rahul@zomato.com',
      phone: '+91 99887 76655',
      conversationSummary: 'Enquiry for 350 onboarding kits',
      consentToContact: true,
    }),
  });

  assert.equal(res.status, 201);
  const data = (await res.json()) as any;
  assert.equal(data.success, true);
  assert.ok(data.referenceId.startsWith('enq-'));
});
