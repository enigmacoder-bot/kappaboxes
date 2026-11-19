-- B2B Corporate Gifting Schema Migration
-- Migration: 20261114_initial_schema.sql

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: gift_offerings
CREATE TABLE IF NOT EXISTS gift_offerings (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    offering_type TEXT NOT NULL CHECK (offering_type IN ('product', 'kit', 'hamper', 'service', 'category', 'idea')),
    category TEXT NOT NULL,
    target_audience_tags TEXT[] NOT NULL DEFAULT '{}',
    occasion_tags TEXT[] NOT NULL DEFAULT '{}',
    industry_tags TEXT[] NOT NULL DEFAULT '{}',
    customisation_options TEXT[] NOT NULL DEFAULT '{}',
    price_min_paise BIGINT NULL,
    price_max_paise BIGINT NULL,
    price_is_estimate BOOLEAN DEFAULT TRUE,
    minimum_quantity INTEGER NULL,
    lead_time_days TEXT NULL,
    image_url TEXT NULL,
    product_url TEXT NULL,
    availability_status TEXT NOT NULL DEFAULT 'quote_required' CHECK (availability_status IN ('in_stock', 'made_to_order', 'quote_required', 'seasonal')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: business_enquiries
CREATE TABLE IF NOT EXISTS business_enquiries (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::TEXT,
    session_id TEXT NOT NULL,
    company_name TEXT NOT NULL,
    industry TEXT NULL,
    contact_name TEXT NOT NULL,
    business_email TEXT NOT NULL,
    phone TEXT NOT NULL,
    gifting_purpose TEXT NULL,
    occasion TEXT NULL,
    target_audience TEXT NULL,
    quantity INTEGER NULL,
    budget_per_unit_paise BIGINT NULL,
    total_budget_paise BIGINT NULL,
    customisation_requirements TEXT NULL,
    delivery_locations TEXT NULL,
    required_delivery_date TEXT NULL,
    additional_requirements TEXT NULL,
    conversation_summary TEXT NOT NULL,
    consent_to_contact BOOLEAN NOT NULL DEFAULT TRUE,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'in_progress', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: chat_sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
    id TEXT PRIMARY KEY,
    ip_hash TEXT NOT NULL,
    message_count INTEGER NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_gift_offerings_category ON gift_offerings (category);
CREATE INDEX IF NOT EXISTS idx_gift_offerings_active ON gift_offerings (is_active);
CREATE INDEX IF NOT EXISTS idx_gift_offerings_type ON gift_offerings (offering_type);
CREATE INDEX IF NOT EXISTS idx_gift_offerings_audience ON gift_offerings USING GIN (target_audience_tags);
CREATE INDEX IF NOT EXISTS idx_gift_offerings_occasion ON gift_offerings USING GIN (occasion_tags);
CREATE INDEX IF NOT EXISTS idx_business_enquiries_status ON business_enquiries (status);
CREATE INDEX IF NOT EXISTS idx_business_enquiries_created ON business_enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_expires ON chat_sessions (expires_at);

-- Row Level Security (RLS)
ALTER TABLE gift_offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Anonymous public read access for active gift offerings
CREATE POLICY "Public read active gift offerings"
    ON gift_offerings FOR SELECT
    USING (is_active = TRUE);

-- Public insert policy for enquiries (visitors can submit leads, but not read other leads)
CREATE POLICY "Public insert business enquiries"
    ON business_enquiries FOR INSERT
    WITH CHECK (TRUE);

-- Sessions management: allow session insert and update for session owner
CREATE POLICY "Public session upsert"
    ON chat_sessions FOR ALL
    USING (TRUE)
    WITH CHECK (TRUE);
