-- ============================================================
-- IoT-SPMS: Seed Data for Development
-- Run this AFTER 001_schema.sql and 002_rls_policies.sql
-- ============================================================

-- ==================== PARKING ZONES =========================

INSERT INTO parking_zones (id, name, description, total_slots, hourly_rate) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Zone A — Building H6', 'Open-air parking near H6 building', 5, 5000.00),
    ('a0000000-0000-0000-0000-000000000002', 'Zone B — Library',     'Covered parking near central library', 5, 5000.00),
    ('a0000000-0000-0000-0000-000000000003', 'VIP — Admin Block',    'Reserved VIP parking for faculty',    5, 10000.00);

-- ==================== PARKING SLOTS =========================

-- Zone A (5 slots)
INSERT INTO parking_slots (zone_id, label, sensor_id, status) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'A-01', 'S-A01', 'free'),
    ('a0000000-0000-0000-0000-000000000001', 'A-02', 'S-A02', 'free'),
    ('a0000000-0000-0000-0000-000000000001', 'A-03', 'S-A03', 'free'),
    ('a0000000-0000-0000-0000-000000000001', 'A-04', 'S-A04', 'free'),
    ('a0000000-0000-0000-0000-000000000001', 'A-05', 'S-A05', 'free');

-- Zone B (5 slots)
INSERT INTO parking_slots (zone_id, label, sensor_id, status) VALUES
    ('a0000000-0000-0000-0000-000000000002', 'B-01', 'S-B01', 'free'),
    ('a0000000-0000-0000-0000-000000000002', 'B-02', 'S-B02', 'free'),
    ('a0000000-0000-0000-0000-000000000002', 'B-03', 'S-B03', 'free'),
    ('a0000000-0000-0000-0000-000000000002', 'B-04', 'S-B04', 'free'),
    ('a0000000-0000-0000-0000-000000000002', 'B-05', 'S-B05', 'free');

-- VIP Zone (5 slots)
INSERT INTO parking_slots (zone_id, label, sensor_id, status) VALUES
    ('a0000000-0000-0000-0000-000000000003', 'V-01', 'S-V01', 'free'),
    ('a0000000-0000-0000-0000-000000000003', 'V-02', 'S-V02', 'free'),
    ('a0000000-0000-0000-0000-000000000003', 'V-03', 'S-V03', 'free'),
    ('a0000000-0000-0000-0000-000000000003', 'V-04', 'S-V04', 'free'),
    ('a0000000-0000-0000-0000-000000000003', 'V-05', 'S-V05', 'free');
