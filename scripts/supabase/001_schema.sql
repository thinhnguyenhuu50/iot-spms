-- ============================================================
-- IoT-SPMS: Database Schema
-- Run this in Supabase SQL Editor (Settings → SQL Editor)
-- ============================================================

-- ==================== CUSTOM TYPES ==========================

CREATE TYPE user_role AS ENUM ('student', 'faculty', 'staff', 'admin', 'visitor');
CREATE TYPE slot_status AS ENUM ('free', 'occupied', 'unknown');
CREATE TYPE transaction_status AS ENUM ('pending', 'success', 'failed');

-- ==================== TABLES ================================

-- 1. Users (linked to Supabase Auth)
CREATE TABLE users (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    sso_id      TEXT UNIQUE NOT NULL,
    role        user_role NOT NULL DEFAULT 'student',
    full_name   TEXT NOT NULL DEFAULT '',
    email       TEXT NOT NULL DEFAULT '',
    license_plate TEXT DEFAULT '',
    balance     NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Parking Zones
CREATE TABLE parking_zones (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    total_slots INTEGER NOT NULL DEFAULT 0,
    hourly_rate NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Parking Slots
CREATE TABLE parking_slots (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_id      UUID NOT NULL REFERENCES parking_zones(id) ON DELETE CASCADE,
    label        TEXT NOT NULL,                       -- e.g. "A-01"
    sensor_id    TEXT UNIQUE,                          -- physical sensor ID, e.g. "S-A1"
    status       slot_status NOT NULL DEFAULT 'free',
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(zone_id, label)
);

-- 4. Parking Sessions (entry/exit log + billing)
CREATE TABLE parking_sessions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    slot_id     UUID NOT NULL REFERENCES parking_slots(id) ON DELETE CASCADE,
    entry_time  TIMESTAMPTZ NOT NULL DEFAULT now(),
    exit_time   TIMESTAMPTZ,                           -- NULL while parked
    amount_due  NUMERIC(10,2) DEFAULT 0.00,
    is_active   BOOLEAN NOT NULL DEFAULT true,         -- quick lookup for current sessions
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Transactions (BKPay payment ledger)
CREATE TABLE transactions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id  UUID NOT NULL REFERENCES parking_sessions(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount      NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    bkpay_ref   TEXT,                                  -- mock BKPay reference ID
    status      transaction_status NOT NULL DEFAULT 'pending',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==================== INDEXES ===============================

CREATE INDEX idx_parking_slots_status ON parking_slots(status);
CREATE INDEX idx_parking_slots_zone ON parking_slots(zone_id);
CREATE INDEX idx_parking_sessions_user ON parking_sessions(user_id);
CREATE INDEX idx_parking_sessions_slot ON parking_sessions(slot_id);
CREATE INDEX idx_parking_sessions_active ON parking_sessions(is_active) WHERE is_active = true;
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_session ON transactions(session_id);

-- ==================== UPDATED_AT TRIGGER ====================

-- Auto-update the `updated_at` column on the users table
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ==================== AUTH → PUBLIC.USERS SYNC ==============

-- When a new user signs up via Supabase Auth, auto-create a row
-- in public.users with metadata from the signup request.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, sso_id, role, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.email, ''),
        COALESCE(NEW.raw_user_meta_data->>'sso_id', ''),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'student'),
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();
