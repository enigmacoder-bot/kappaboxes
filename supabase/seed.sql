-- B2B Corporate Gifting Seed Data
-- Seed: supabase/seed.sql

INSERT INTO gift_offerings (
    id, name, description, offering_type, category,
    target_audience_tags, occasion_tags, industry_tags,
    customisation_options, price_min_paise, price_max_paise,
    price_is_estimate, minimum_quantity, lead_time_days,
    image_url, product_url, availability_status, is_active
) VALUES
-- 1. Employee Welcome / Onboarding Kits (Confirmed Kits)
(
    'kit-onboard-elite',
    'Executive Onboarding Welcome Kit',
    'Curated new-hire welcome set featuring a premium thermal tumbler, hardcover debossed notebook, sleek metal rollerball pen, wireless charging pad, and branded welcome card in a custom magnetic rigid presentation box.',
    'kit',
    'Employee Onboarding',
    ARRAY['employees', 'new hires', 'executives'],
    ARRAY['onboarding', 'welcome', 'joining'],
    ARRAY['technology', 'consulting', 'corporate', 'finance'],
    ARRAY['Logo Debossing', 'Screen Printing', 'Custom Welcome Card', 'Laser Engraving on Tumbler', 'Custom Color Theme'],
    145000, 220000, TRUE, 25, '8-12 Business Days',
    '/src/assets/images/product_corporate_hamper_1794662088046.jpg', NULL, 'made_to_order', TRUE
),
(
    'kit-onboard-essential',
    'Essential First-Day Starter Kit',
    'Eco-friendly employee joining kit with kraft notebook, bamboo ballpoint pen, stainless steel water bottle, and organic cotton laptop sleeve in a custom corrugated mailer.',
    'kit',
    'Employee Onboarding',
    ARRAY['employees', 'new hires', 'interns', 'general staff'],
    ARRAY['onboarding', 'welcome', 'joining'],
    ARRAY['startups', 'technology', 'education', 'general'],
    ARRAY['Screen Printing', 'Custom Sleeve Band', 'Personalized Welcome Note'],
    65000, 110000, TRUE, 50, '7-10 Business Days',
    '/src/assets/images/product_corrugated_mailer_1794662089404.jpg', NULL, 'made_to_order', TRUE
),

-- 2. Festive & Diwali Hampers (Confirmed Hampers)
(
    'hamper-diwali-royal',
    'Royal Festive Dry Fruit & Delicacy Box',
    'Opulent celebratory gift box with premium roasted almonds, cashews, artisanal brass diya set, organic wildflower honey, and gourmet dark chocolate packed in an intricately gold-foiled rigid keepsake box.',
    'hamper',
    'Festive Hampers',
    ARRAY['clients', 'employees', 'partners', 'executives'],
    ARRAY['diwali', 'new year', 'festivals', 'celebration'],
    ARRAY['banking', 'real estate', 'consulting', 'manufacturing'],
    ARRAY['Gold/Copper Foil Stamping', 'Custom Sleeve', 'Personalized CEO Greeting Card', 'Branded Ribbon'],
    125000, 250000, TRUE, 30, '10-14 Business Days',
    '/src/assets/images/product_festive_sleeve_1794662089954.jpg', NULL, 'made_to_order', TRUE
),
(
    'hamper-diwali-artisan',
    'Artisanal Diwali Celebration Hamper',
    'Handcrafted brass oil lamp, ceramic soy wax candle, assorted gourmet sweets, flavoured dry fruits, and festive card packaged in an elegant drawer & sleeve box with traditional motifs.',
    'hamper',
    'Festive Hampers',
    ARRAY['employees', 'associates', 'clients'],
    ARRAY['diwali', 'festivals', 'annual day'],
    ARRAY['retail', 'it services', 'corporate'],
    ARRAY['Custom Outer Sleeve', 'Foil Stamping', 'Branded Greeting Note'],
    85000, 160000, TRUE, 50, '10-12 Business Days',
    '/src/assets/images/product_ribbon_keepsake_1794662337319.jpg', NULL, 'made_to_order', TRUE
),

-- 3. Client & Partner Appreciation Gifts (Confirmed Products & Hampers)
(
    'gift-client-prestige',
    'Prestige Executive Client Gift Set',
    'Sophisticated gift set for valued enterprise partners featuring Italian vegan leather portfolio organizer, matte-black Parker pen, stainless steel insulated flask, and wireless power bank in a premium magnetic-snap gift chest.',
    'kit',
    'Client Appreciation',
    ARRAY['clients', 'partners', 'cxos', 'board members'],
    ARRAY['client appreciation', 'deal closure', 'milestone', 'year-end'],
    ARRAY['finance', 'law', 'consulting', 'enterprise b2b'],
    ARRAY['Laser Engraving', 'Leather Debossing', 'Custom Brand Ribbon', 'Wax Seal Sealant'],
    220000, 380000, TRUE, 20, '10-14 Business Days',
    '/src/assets/images/product_rigid_magnetic_1794662087585.jpg', NULL, 'quote_required', TRUE
),
(
    'hamper-gourmet-connoisseur',
    'Artisanal Coffee & Tea Connoisseur Hamper',
    'Single-estate Arabica coffee beans, French press, ceramic pour-over mug, herbal tea infusions, and artisanal biscotti in a reusable handcrafted pine wood or luxury greyboard box.',
    'hamper',
    'Client Appreciation',
    ARRAY['clients', 'partners', 'executives', 'vendors'],
    ARRAY['client appreciation', 'thanksgiving', 'new year', 'relationship building'],
    ARRAY['creative', 'marketing', 'tech', 'consulting'],
    ARRAY['Laser-etched Logo', 'Custom Bellyband', 'Tasting Notes Card'],
    160000, 275000, TRUE, 25, '8-12 Business Days',
    '/src/assets/images/product_celebration_kit_1794662337512.jpg', NULL, 'made_to_order', TRUE
),

-- 4. Conference, Event & Summit Kits (Confirmed Kits)
(
    'kit-event-summit',
    'Annual Leadership Summit Event Kit',
    'Sleek delegate package containing a custom lanyard & metal badge, conference notebook with pen loop, matte insulated water bottle, and canvas tote bag packaged in a compact custom-printed mailer.',
    'kit',
    'Event & Conference Kits',
    ARRAY['delegates', 'event attendees', 'speakers', 'executives'],
    ARRAY['conference', 'annual general meeting', 'summit', 'hackathon'],
    ARRAY['technology', 'healthcare', 'education', 'associations'],
    ARRAY['All-Over Mailer Printing', 'Badge Customization', 'Color-matched merchandise'],
    45000, 95000, TRUE, 100, '7-10 Business Days',
    '/src/assets/images/product_corrugated_mailer_1794662089404.jpg', NULL, 'made_to_order', TRUE
),
(
    'kit-speaker-vip',
    'VIP Speaker & Keynote Appreciation Box',
    'High-end recognition box with noise-canceling wireless earbuds, custom brass desk keepsake, personalized leather notebook, and thank-you letter from conference chairs in a luxury matte magnetic presentation box.',
    'kit',
    'Event & Conference Kits',
    ARRAY['keynote speakers', 'vip guests', 'board members'],
    ARRAY['conference', 'summit', 'awards'],
    ARRAY['technology', 'academics', 'corporate summits'],
    ARRAY['Laser Name Engraving', 'Hot Foil Stamping', 'Personalized Letter'],
    350000, 600000, TRUE, 10, '10-12 Business Days',
    '/src/assets/images/product_rigid_magnetic_1794662087585.jpg', NULL, 'quote_required', TRUE
),

-- 5. Promotional & Branded Merchandise
(
    'merch-tech-bundle',
    'Eco-Smart Tech Merchandise Bundle',
    'Wheat-straw wireless charger, fast-charging braided nylon cable set, and Bluetooth 5.0 mini speaker, all co-branded with corporate identity in an eco-friendly tuck-top gift box.',
    'product',
    'Branded Merchandise',
    ARRAY['employees', 'leads', 'prospects', 'trade show visitors'],
    ARRAY['promotions', 'trade shows', 'campaigns', 'marketing'],
    ARRAY['saas', 'consumer tech', 'telecom', 'media'],
    ARRAY['UV Digital Color Print', 'Laser Engraving', 'Eco Kraft Packaging'],
    70000, 130000, TRUE, 100, '7-10 Business Days',
    '/src/assets/images/product_corporate_hamper_1794662088046.jpg', NULL, 'made_to_order', TRUE
),

-- 6. Custom Packaging Solutions (Products)
(
    'box-rigid-magnetic',
    'Custom Rigid Magnetic Gift Box',
    '1200 GSM high-density greyboard with concealed neodymium magnets, matte lamination, custom die-cut EVA foam insert tailored to your products, and foil-stamped corporate logo.',
    'product',
    'Custom Packaging',
    ARRAY['companies', 'brands', 'corporates'],
    ARRAY['bulk gifting', 'custom packaging', 'product packaging'],
    ARRAY['all industries'],
    ARRAY['Matte/Gloss Lamination', 'Foil Stamping', 'Spot UV', 'Custom Foam Die-cuts'],
    18000, 45000, TRUE, 100, '10-12 Business Days',
    '/src/assets/images/product_rigid_magnetic_1794662087585.jpg', NULL, 'in_stock', TRUE
),

-- 7. Illustrative Ideas (Needs Sales Confirmation)
(
    'idea-wellness-retreat',
    'Employee Wellness & Mindfulness Box (Illustrative Concept)',
    'Concept package designed for mental health month or year-end wellness: copper water vessel, aromatic essential oil diffuser, herbal chamomile tea, stress ball, and guided journal.',
    'idea',
    'Employee Appreciation',
    ARRAY['employees', 'teams', 'remote workers'],
    ARRAY['wellness', 'mental health month', 'appreciation', 'work anniversary'],
    ARRAY['tech', 'remote first', 'healthcare'],
    ARRAY['Concept customisation upon discussion with sales team'],
    NULL, NULL, TRUE, 50, 'Requires Sales Confirmation',
    '/src/assets/images/product_celebration_kit_1794662337512.jpg', NULL, 'quote_required', TRUE
),
(
    'idea-sustainability-zero-waste',
    'Zero-Waste Sustainability Hamper (Illustrative Concept)',
    'Eco-conscious concept including cork desk organizers, upcycled coffee-husk coffee mug, seed paper stationery, and plantable calendar in a 100% biodegradable corrugated box.',
    'idea',
    'Promotional Merchandise',
    ARRAY['employees', 'clients', 'esg initiatives'],
    ARRAY['earth day', 'sustainability initiatives', 'annual awards'],
    ARRAY['esg', 'energy', 'cleantech', 'corporate'],
    ARRAY['Concept customisation upon discussion with sales team'],
    NULL, NULL, TRUE, 100, 'Requires Sales Confirmation',
    '/src/assets/images/product_corrugated_mailer_1794662089404.jpg', NULL, 'quote_required', TRUE
),

-- 8. Corporate Gifting Services
(
    'service-pan-india-kitting',
    'Multi-Location Direct Employee Delivery & Kitting Service',
    'Turnkey warehousing, kitting, individual address collection portal, tracking, and doorstep courier delivery across 200+ cities in India and overseas for distributed remote workforces.',
    'service',
    'Logistics & Kitting',
    ARRAY['corporates', 'hr teams', 'remote companies'],
    ARRAY['onboarding', 'festivals', 'annual summits'],
    ARRAY['all industries'],
    ARRAY['Individual Address Verification Portal', 'Branded Tracking SMS/Email', 'Tamper-evident Packaging'],
    NULL, NULL, TRUE, 50, 'Custom Service Schedule',
    '/src/assets/images/hero_packaging_suite_1794662087131.jpg', NULL, 'quote_required', TRUE
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    offering_type = EXCLUDED.offering_type,
    category = EXCLUDED.category,
    target_audience_tags = EXCLUDED.target_audience_tags,
    occasion_tags = EXCLUDED.occasion_tags,
    industry_tags = EXCLUDED.industry_tags,
    customisation_options = EXCLUDED.customisation_options,
    price_min_paise = EXCLUDED.price_min_paise,
    price_max_paise = EXCLUDED.price_max_paise,
    price_is_estimate = EXCLUDED.price_is_estimate,
    minimum_quantity = EXCLUDED.minimum_quantity,
    lead_time_days = EXCLUDED.lead_time_days,
    image_url = EXCLUDED.image_url,
    availability_status = EXCLUDED.availability_status,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();
