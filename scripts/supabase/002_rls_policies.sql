-- ============================================================
-- IoT-SPMS: Row Level Security (RLS) Policies
-- Run this AFTER 001_schema.sql in Supabase SQL Editor
-- ============================================================

-- ==================== ENABLE RLS ============================

ALTER TABLE users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_zones    ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_slots    ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions     ENABLE ROW LEVEL SECURITY;

-- ==================== HELPER FUNCTION =======================

-- Check if the current authenticated user has the 'admin' role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    );
$$ LANGUAGE sql SECURITY DEFINER
SET search_path = '';

-- ==================== USERS TABLE ===========================

-- Users can read their own profile
CREATE POLICY "users_select_own"
    ON users FOR SELECT
    USING (auth.uid() = id);

-- Admins can read all user profiles
CREATE POLICY "users_select_admin"
    ON users FOR SELECT
    USING (is_admin());

-- Users can update their own profile (name, license plate, etc.)
CREATE POLICY "users_update_own"
    ON users FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Admins can update any user (e.g. role changes)
CREATE POLICY "users_update_admin"
    ON users FOR UPDATE
    USING (is_admin());

-- Insert is handled by the auth trigger, no direct inserts needed
-- Delete not allowed via client

-- ==================== PARKING ZONES =========================

-- Anyone (including anonymous) can read parking zones
CREATE POLICY "zones_select_public"
    ON parking_zones FOR SELECT
    USING (true);

-- Only admins can manage zones
CREATE POLICY "zones_insert_admin"
    ON parking_zones FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "zones_update_admin"
    ON parking_zones FOR UPDATE
    USING (is_admin());

CREATE POLICY "zones_delete_admin"
    ON parking_zones FOR DELETE
    USING (is_admin());

-- ==================== PARKING SLOTS =========================

-- Anyone can read slot status (dashboard is public)
CREATE POLICY "slots_select_public"
    ON parking_slots FOR SELECT
    USING (true);

-- Only admins can create/delete slots
CREATE POLICY "slots_insert_admin"
    ON parking_slots FOR INSERT
    WITH CHECK (is_admin());

CREATE POLICY "slots_delete_admin"
    ON parking_slots FOR DELETE
    USING (is_admin());

-- Slot status updates come from the backend using service_role key
-- (which bypasses RLS), so no UPDATE policy is needed for regular users.
-- Admins can also update via dashboard.
CREATE POLICY "slots_update_admin"
    ON parking_slots FOR UPDATE
    USING (is_admin());

-- ==================== PARKING SESSIONS ======================

-- Users can view their own parking sessions
CREATE POLICY "sessions_select_own"
    ON parking_sessions FOR SELECT
    USING (auth.uid() = user_id);

-- Admins can view all sessions
CREATE POLICY "sessions_select_admin"
    ON parking_sessions FOR SELECT
    USING (is_admin());

-- Sessions are created/updated by the backend using service_role key
-- No INSERT/UPDATE policies needed for regular users

-- ==================== TRANSACTIONS ==========================

-- Users can view their own transactions
CREATE POLICY "transactions_select_own"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id);

-- Admins can view all transactions
CREATE POLICY "transactions_select_admin"
    ON transactions FOR SELECT
    USING (is_admin());

-- Transactions are created/updated by the backend using service_role key
-- No INSERT/UPDATE policies needed for regular users
