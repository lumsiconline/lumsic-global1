-- ============================================================================
-- LUMSIC GLOBAL ASTROLOGY PLATFORM
-- Supabase PostgreSQL Schema & Security Policies
-- Migration: 20261101_init_lumsic.sql
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'US',
    currency TEXT NOT NULL DEFAULT 'USD',
    timezone TEXT NOT NULL DEFAULT 'UTC',
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'astrologer', 'admin')),
    astrologer_id TEXT UNIQUE, -- e.g. LUM001
    avatar_url TEXT,
    is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. USER ROLES (Explicit RBAC)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('customer', 'astrologer', 'admin')),
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- 3. READERS / ASTROLOGERS
CREATE TABLE IF NOT EXISTS public.readers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    astrologer_id TEXT UNIQUE NOT NULL, -- Unique Astrologer ID: LUM001, etc.
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    avatar_url TEXT NOT NULL,
    specializations TEXT[] NOT NULL DEFAULT '{}',
    languages TEXT[] NOT NULL DEFAULT '{}',
    experience_years INT NOT NULL DEFAULT 5,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    reviews_count INT NOT NULL DEFAULT 0,
    price_per_minute NUMERIC(10, 2) NOT NULL DEFAULT 2.50,
    currency TEXT NOT NULL DEFAULT 'USD',
    bio TEXT NOT NULL,
    is_online BOOLEAN NOT NULL DEFAULT FALSE,
    is_busy BOOLEAN NOT NULL DEFAULT FALSE,
    workflow_enabled BOOLEAN NOT NULL DEFAULT TRUE, -- CRITICAL: Admin ON/OFF switch
    total_consultations INT NOT NULL DEFAULT 0,
    earnings_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. READER AVAILABILITY LOGS
CREATE TABLE IF NOT EXISTS public.reader_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reader_id UUID NOT NULL REFERENCES public.readers(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('online', 'offline', 'busy')),
    workflow_state BOOLEAN NOT NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. CONSULTATION SESSIONS
CREATE TABLE IF NOT EXISTS public.consultation_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_number TEXT UNIQUE NOT NULL, -- LUM-CS-XXXX
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    astrologer_id TEXT NOT NULL REFERENCES public.readers(astrologer_id) ON DELETE RESTRICT,
    reader_id UUID NOT NULL REFERENCES public.readers(id) ON DELETE RESTRICT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'active', 'rejected', 'completed', 'cancelled')),
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    duration_seconds INT NOT NULL DEFAULT 0,
    price_per_minute NUMERIC(10, 2) NOT NULL,
    total_cost NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    initial_topic TEXT,
    rejection_reason TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review_comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. CHAT MESSAGES
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.consultation_sessions(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    sender_role TEXT NOT NULL CHECK (sender_role IN ('customer', 'astrologer', 'admin', 'system')),
    sender_name TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. CHAT ASSIGNMENTS & REASSIGNMENTS
CREATE TABLE IF NOT EXISTS public.chat_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.consultation_sessions(id) ON DELETE CASCADE,
    from_astrologer_id TEXT,
    to_astrologer_id TEXT NOT NULL,
    assigned_by UUID REFERENCES public.profiles(id),
    reason TEXT NOT NULL,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. WALLETS
CREATE TABLE IF NOT EXISTS public.wallets (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0.00),
    currency TEXT NOT NULL DEFAULT 'USD',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. WALLET TRANSACTIONS (Auditable Ledger)
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('deposit', 'consultation_deduction', 'refund', 'payout')),
    amount NUMERIC(10, 2) NOT NULL,
    balance_after NUMERIC(12, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    description TEXT NOT NULL,
    reference_session_id UUID REFERENCES public.consultation_sessions(id) ON DELETE SET NULL,
    payment_provider TEXT,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. PAYMENT INTENTS
CREATE TABLE IF NOT EXISTS public.payment_intents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider_intent_id TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'cancelled')),
    provider TEXT NOT NULL DEFAULT 'stripe',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('session_request', 'session_accepted', 'session_rejected', 'payment', 'system', 'workflow')),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    session_id UUID REFERENCES public.consultation_sessions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID UNIQUE NOT NULL REFERENCES public.consultation_sessions(id) ON DELETE CASCADE,
    reader_id UUID NOT NULL REFERENCES public.readers(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    customer_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. APP SETTINGS
CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. ACTIVITY LOGS (Admin Audit Trail)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    actor_name TEXT NOT NULL,
    actor_role TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE & ROUTING
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_readers_astrologer_id ON public.readers(astrologer_id);
CREATE INDEX IF NOT EXISTS idx_readers_workflow ON public.readers(workflow_enabled, is_online);
CREATE INDEX IF NOT EXISTS idx_consultation_status ON public.consultation_sessions(status);
CREATE INDEX IF NOT EXISTS idx_consultation_customer ON public.consultation_sessions(customer_id);
CREATE INDEX IF NOT EXISTS idx_consultation_astrologer ON public.consultation_sessions(astrologer_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id, created_at);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user ON public.wallet_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.readers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view their own profile, admins can view all
CREATE POLICY "Profiles view policy" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- Readers: Public can view active readers; astrologers view their own; admins view all
CREATE POLICY "Readers public select" ON public.readers
    FOR SELECT USING (TRUE);

CREATE POLICY "Readers update policy" ON public.readers
    FOR UPDATE USING (user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- Consultation Sessions: Customer, assigned Astrologer, or Admin
CREATE POLICY "Consultations access" ON public.consultation_sessions
    FOR ALL USING (
        customer_id = auth.uid() 
        OR reader_id IN (SELECT id FROM public.readers WHERE user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Chat Messages: Authorized participants only
CREATE POLICY "Chat messages access" ON public.chat_messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.consultation_sessions cs
            WHERE cs.id = session_id AND (
                cs.customer_id = auth.uid()
                OR cs.reader_id IN (SELECT r.id FROM public.readers r WHERE r.user_id = auth.uid())
                OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
            )
        )
    );

-- Wallets: Owners and Admins only
CREATE POLICY "Wallet access" ON public.wallets
    FOR SELECT USING (user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- Notifications: User only
CREATE POLICY "Notifications user policy" ON public.notifications
    FOR ALL USING (user_id = auth.uid());
