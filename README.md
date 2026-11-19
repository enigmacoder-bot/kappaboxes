# KappaBoxes™ — B2B Corporate Gifting Sales Assistant & Custom Packaging Website

A production-conscious, cost-effective **B2B Corporate Gifting Sales Assistant** integrated into the **KappaBoxes™** website (headquartered in Bengaluru, Karnataka, India).

The chatbot guides business visitors (HR leaders, corporate procurement, founders, event managers, and marketing directors) through corporate gifting discovery, recommends structured offerings, collects qualified business requirements, and converts conversations into structured WhatsApp Click-to-Chat enquiries and database leads.

---

## 1. Key Business Features

- **Strictly B2B Corporate Focus:** Tailored for corporate buyers. Deliberately filters out and politely deflects personal/consumer gift shopping (e.g. birthday gifts for friends/partners).
- **Progressive B2B Requirement Discovery:** Unobtrusively extracts and tracks company name, purpose/occasion, target audience, quantity, budget per unit, customisation requirements, and delivery logistics — asking only one relevant question at a time.
- **Commercial Integrity & Zero Hallucination:** Employs a controlled retrieval-augmented pipeline. The AI only communicates confirmed products and services or clearly flagged illustrative concepts from the database; it never fabricates prices, stock availability, discounts, or delivery dates.
- **WhatsApp Click-to-Chat Enquiry Generation:** Formats clean, structured enquiry summaries ready for instant submission to the company's WhatsApp sales desk (`https://wa.me/<NUMBER>?text=...`) with manual user review and edit capability.
- **Direct Sales Lead Capture:** Allows corporate visitors to submit official quote requests with contact details and explicit consent verification.
- **Responsive Floating Widget:** Beautiful, mobile- and desktop-friendly floating chat interface matching the website's brand identity.

---

## 2. Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19 + TypeScript | Reuses existing styling, components, and Tailwind CSS |
| **Styling** | Tailwind CSS v4 | Brand colors: `#0088cc` (Blue), `#cc181e` (Crimson), `#222222` |
| **Icons & Animation** | `lucide-react`, `motion` | Lightweight, accessible UI primitives |
| **Backend API** | Node.js + Express + TypeScript (`tsx`) | Validated REST endpoints for chat, gifts, enquiries, drafts |
| **AI Model** | Google Gemini Flash-Lite | Official `@google/genai` SDK (`gemini-flash-lite-latest` or `gemini-3.8-flash`), with deterministic B2B fallback |
| **Database** | Supabase PostgreSQL | `gift_offerings`, `business_enquiries`, `chat_sessions` + local in-memory fallback |
| **Validation** | Zod | Strict schema validation on all inputs and outputs |
| **Abuse Protection** | `express-rate-limit`, `helmet`, `cors` | Per-IP and per-session rate limits, body limits, Turnstile token validation |
| **Testing** | Node.js Test Runner (`node:test`) | Fast, native TypeScript execution via `tsx --test` |

---

## 3. Project Structure

```text
├── server/
│   ├── ai/
│   │   └── gemini.ts           # Gemini Flash-Lite integration, prompt & B2B engine
│   ├── db/
│   │   ├── client.ts           # Supabase client + robust in-memory fallback
│   │   ├── schema.ts           # TypeScript interfaces for DB models
│   │   └── seedData.ts         # Preloaded corporate gifting catalogue
│   ├── middleware/
│   │   └── security.ts         # Helmet, CORS, Rate Limiters, Turnstile check
│   ├── routes/
│   │   └── api.ts              # Endpoints: /chat, /gifts, /enquiries, /whatsapp-draft
│   ├── validation/
│   │   └── schemas.ts          # Zod validation schemas
│   ├── config.ts               # Environment configuration & defaults
│   └── index.ts                # Express app setup and static serving
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   ├── CorporateChatWidget.tsx # Floating responsive chat assistant
│   │   │   ├── OfferingCard.tsx        # Structured offering recommendation card
│   │   │   ├── WhatsAppModal.tsx       # WhatsApp preview, editor & launch modal
│   │   │   └── LeadCaptureModal.tsx    # Official sales quotation submission modal
│   │   └── ...                         # Existing website components
│   ├── types/
│   │   └── chat.ts             # Client chat and offering types
│   ├── App.tsx                 # Root application with chat widget mounted
│   └── ...
├── supabase/
│   ├── migrations/
│   │   └── 20261114_initial_schema.sql # Database schema with RLS and indexes
│   └── seed.sql                # Seed data for corporate kits, hampers & ideas
├── tests/
│   ├── functional.test.ts      # Functional requirements and WhatsApp tests
│   ├── ai-quality.test.ts      # AI persona, zero-hallucination & anti-consumer tests
│   ├── security.test.ts        # Prompt injection, rate-limiting & boundary tests
│   └── integration-http.test.ts # HTTP API integration tests
├── .env.example                # Sample environment variables
├── package.json
└── vite.config.ts              # Vite config with API proxy
```

---

## 4. Getting Started

### 4.1 Prerequisites
- Node.js 20+ installed
- (Optional) Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)
- (Optional) Supabase project credentials

### 4.2 Installation
```bash
# Clone and enter the directory
cd gifting-app-main

# Install dependencies
npm install
```

### 4.3 Environment Variables
Copy the example environment configuration:
```bash
cp .env.example .env
```
Open `.env` and set your preferred keys:
```ini
# Google Gemini API Key (optional for testing; fallback consultant activates if empty)
GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-flash-lite-latest"

# Company WhatsApp Sales Desk (digits only, e.g. 13125550184 or 919876543210)
COMPANY_WHATSAPP_NUMBER="13125550184"

# Supabase (optional; uses pre-seeded in-memory store if unset)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 4.4 Running in Development
Run both the Express backend and the Vite frontend:
```bash
# In terminal 1: Start the backend API server (runs on http://localhost:3001)
npm run server

# In terminal 2: Start Vite development server (runs on http://localhost:3000)
npm run dev
```
Open `http://localhost:3000` in your browser. The floating chatbot launcher will appear at the bottom-right corner.

### 4.5 Running Automated Tests
Run all 39 unit, functional, AI quality, security, and HTTP integration tests:
```bash
npm test
```

### 4.6 Building for Production
```bash
# Build the React frontend
npm run build

# Start the unified production server
npm start
```
The server serves both the `/api` endpoints and the static production build on `http://localhost:3001` (or the configured `PORT`).

---

## 5. Database Setup & Supabase Migrations

When ready to connect a live Supabase PostgreSQL database:

1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in the Supabase Dashboard.
3. Run the schema migration from `supabase/migrations/20261114_initial_schema.sql`. This creates:
   - `gift_offerings`: Catalogue offerings, tags, pricing, and availability status.
   - `business_enquiries`: Structured leads with conversation summaries and contact consent.
   - `chat_sessions`: Session counters and expiration policies.
   - Row Level Security (RLS) policies and indexes.
4. Run the seed data from `supabase/seed.sql` to populate confirmed onboarding kits, festive hampers, client gifts, event kits, and illustrative ideas.
5. Add your `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to `.env`.

---

## 6. Catalogue Management Guide

The company can easily manage offerings directly in the `gift_offerings` table.

### 6.1 Distinguishing Offering Types
The database explicitly distinguishes between:
- `'kit'` or `'product'` or `'hamper'`: Confirmed products with verified MOQ and price ranges.
- `'idea'`: Illustrative concepts designed to spark customer interest. The assistant clearly informs visitors that these concepts require sales team consultation.
- `'service'`: Value-added capabilities such as Pan-India direct employee delivery, kitting, and warehousing.

### 6.2 Adding a New Gift Offering
```sql
INSERT INTO gift_offerings (
    id, name, description, offering_type, category,
    target_audience_tags, occasion_tags, industry_tags,
    customisation_options, price_min_paise, price_max_paise,
    price_is_estimate, minimum_quantity, lead_time_days,
    image_url, availability_status, is_active
) VALUES (
    'kit-new-year-recharge',
    'New Year Reset & Wellness Hamper',
    'Curated wellness box featuring an acoustic white-noise speaker, copper hydration bottle, organic matcha tea, and hardcover goal journal.',
    'kit',
    'Festive Hampers',
    ARRAY['employees', 'associates', 'clients'],
    ARRAY['new year', 'festivals', 'wellness'],
    ARRAY['tech', 'consulting', 'corporate'],
    ARRAY['Custom Sleeve', 'Debossed Logo', 'Personalized CEO Card'],
    160000, 240000, -- ₹1,600 to ₹2,400 in paise
    TRUE, 50, '10-12 Business Days',
    '/src/assets/images/product_celebration_kit_1794662337512.jpg',
    'made_to_order', TRUE
);
```

### 6.3 Updating Pricing or MOQ
```sql
-- Update minimum quantity and pricing for an existing offering
UPDATE gift_offerings
SET
    minimum_quantity = 25,
    price_min_paise = 135000,
    price_max_paise = 195000,
    updated_at = NOW()
WHERE id = 'kit-onboard-elite';
```

### 6.4 Deactivating a Seasonal or Out-of-Stock Offering
To remove an offering from assistant recommendations without deleting historic lead records, simply set `is_active` to `FALSE`:
```sql
UPDATE gift_offerings
SET is_active = FALSE, updated_at = NOW()
WHERE id = 'hamper-diwali-royal';
```

---

## 7. WhatsApp Enquiry Flow

1. The visitor explores corporate gifting solutions in the chat widget.
2. The assistant captures organisation name, quantity, budget, customisation, and delivery location.
3. The visitor clicks **WhatsApp Draft** in the header or in suggested actions.
4. A preview modal opens displaying the generated summary:
   ```text
   Hello Meridian Packaging! I would like to enquire about corporate gifting solutions.

   *Company:* Acme Technologies Ltd
   *Requirement:* Diwali Festive Gifting
   *Estimated Quantity:* 500 units
   *Target Budget:* ₹1,500 per unit
   *Customisation:* Custom logo branding & packaging required
   *Delivery Location:* Bengaluru

   Please share suitable options, available customisations, and a formal quote.

   Thank you.
   ```
5. The visitor can edit any text directly before clicking **Open in WhatsApp**.
6. The browser opens `https://wa.me/<NUMBER>?text=<ENCODED_MESSAGE>` in a new tab with the message pre-filled.
7. **The user must manually click Send in WhatsApp.** (No automated spam or unauthorized transmission).

---

## 8. Security & Cost Protection Guardrails

- **Prompt Injection Defense:** Strict backend system prompts combined with deterministic catalog retrieval prevent the model from exposing internal instructions, API keys, or executing unauthorized actions.
- **Rate Limiting:** Configured to limit per-IP and per-session volume (default 25 messages per 15 min per session, 60 requests per 15 min per IP).
- **Cost Minimization:** Max AI response tokens capped at 350 tokens; context window strictly limited to the last 10 conversation turns; deterministic fallback engine operates with zero token cost when needed.
- **Lead Protection:** Visitor enquiries are protected by PostgreSQL Row Level Security (RLS) preventing any visitor from reading other visitors' submissions.
