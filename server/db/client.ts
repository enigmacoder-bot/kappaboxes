import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config';
import type { BusinessEnquiry, ChatSession, GiftOffering } from './schema';
import { SEED_OFFERINGS } from './seedData';

// In-memory repositories for fallback and testing
const inMemoryOfferings: GiftOffering[] = [...SEED_OFFERINGS];
const inMemoryEnquiries: BusinessEnquiry[] = [];
const inMemorySessions = new Map<string, ChatSession>();

let supabaseClient: SupabaseClient | null = null;
if (config.supabaseUrl && config.supabaseKey) {
  try {
    supabaseClient = createClient(config.supabaseUrl, config.supabaseKey);
    console.log('[Database] Supabase client initialized.');
  } catch (err) {
    console.warn('[Database] Failed to initialize Supabase client, falling back to in-memory store:', err);
  }
} else {
  console.log('[Database] Supabase credentials not provided. Using in-memory store with seed data.');
}

export interface OfferingFilters {
  category?: string;
  audience?: string;
  occasion?: string;
  offeringType?: string;
  minPricePaise?: number;
  maxPricePaise?: number;
  limit?: number;
  searchTerm?: string;
}

export const offeringsRepo = {
  async findOfferings(filters: OfferingFilters = {}): Promise<GiftOffering[]> {
    if (supabaseClient) {
      try {
        let query = supabaseClient.from('gift_offerings').select('*').eq('is_active', true);

        if (filters.category && filters.category !== 'All') {
          query = query.ilike('category', `%${filters.category}%`);
        }
        if (filters.offeringType) {
          query = query.eq('offering_type', filters.offeringType);
        }
        if (filters.audience) {
          query = query.contains('target_audience_tags', [filters.audience.toLowerCase()]);
        }
        if (filters.occasion) {
          query = query.contains('occasion_tags', [filters.occasion.toLowerCase()]);
        }
        if (filters.maxPricePaise) {
          query = query.or(`price_min_paise.lte.${filters.maxPricePaise},price_min_paise.is.null`);
        }

        const limit = Math.min(filters.limit || 6, 20);
        query = query.limit(limit);

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as GiftOffering[];
        }
      } catch (err) {
        console.warn('[offeringsRepo] Supabase query failed, falling back to in-memory:', err);
      }
    }

    // In-memory deterministic filtering
    let results = inMemoryOfferings.filter((o) => o.is_active);

    if (filters.category && filters.category !== 'All') {
      const catLower = filters.category.toLowerCase();
      results = results.filter((o) => o.category.toLowerCase().includes(catLower));
    }

    if (filters.offeringType) {
      results = results.filter((o) => o.offering_type === filters.offeringType);
    }

    if (filters.audience) {
      const audLower = filters.audience.toLowerCase();
      results = results.filter((o) =>
        o.target_audience_tags.some((t) => t.toLowerCase().includes(audLower) || audLower.includes(t.toLowerCase()))
      );
    }

    if (filters.occasion) {
      const occLower = filters.occasion.toLowerCase();
      results = results.filter((o) =>
        o.occasion_tags.some((t) => t.toLowerCase().includes(occLower) || occLower.includes(t.toLowerCase()))
      );
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      results = results.filter(
        (o) =>
          o.name.toLowerCase().includes(term) ||
          o.description.toLowerCase().includes(term) ||
          o.category.toLowerCase().includes(term) ||
          o.target_audience_tags.some((t) => t.toLowerCase().includes(term)) ||
          o.occasion_tags.some((t) => t.toLowerCase().includes(term))
      );
    }

    if (filters.maxPricePaise) {
      results = results.filter((o) => o.price_min_paise === null || o.price_min_paise <= filters.maxPricePaise!);
    }

    const limit = Math.min(filters.limit || 6, 20);
    return results.slice(0, limit);
  },

  async getAllActiveOfferings(): Promise<GiftOffering[]> {
    return inMemoryOfferings.filter((o) => o.is_active);
  },

  async getOfferingById(id: string): Promise<GiftOffering | null> {
    const found = inMemoryOfferings.find((o) => o.id === id);
    return found || null;
  },
};

export const enquiriesRepo = {
  async createEnquiry(enquiry: Omit<BusinessEnquiry, 'id' | 'created_at' | 'status'>): Promise<BusinessEnquiry> {
    const fullRecord: BusinessEnquiry = {
      ...enquiry,
      id: `enq-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'new',
      created_at: new Date().toISOString(),
    };

    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('business_enquiries').insert([fullRecord]).select().single();
        if (!error && data) {
          return data as BusinessEnquiry;
        }
      } catch (err) {
        console.warn('[enquiriesRepo] Supabase insert failed, keeping in memory:', err);
      }
    }

    inMemoryEnquiries.push(fullRecord);
    return fullRecord;
  },

  async listEnquiries(): Promise<BusinessEnquiry[]> {
    return [...inMemoryEnquiries];
  },
};

export const sessionsRepo = {
  async getOrCreateSession(sessionId: string, ipHash: string): Promise<ChatSession> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    let session = inMemorySessions.get(sessionId);
    if (!session) {
      session = {
        id: sessionId,
        ip_hash: ipHash,
        message_count: 0,
        metadata: {},
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
      };
      inMemorySessions.set(sessionId, session);
    }

    return session;
  },

  async incrementMessageCount(sessionId: string): Promise<number> {
    const session = inMemorySessions.get(sessionId);
    if (session) {
      session.message_count += 1;
      session.updated_at = new Date().toISOString();
      return session.message_count;
    }
    return 1;
  },

  async updateSessionMetadata(sessionId: string, metadata: Record<string, any>): Promise<void> {
    const session = inMemorySessions.get(sessionId);
    if (session) {
      session.metadata = { ...session.metadata, ...metadata };
      session.updated_at = new Date().toISOString();
    }
  },
};
