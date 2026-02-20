/**
 * Session Model — Data Access Layer for parking_sessions table.
 */

import { supabaseAdmin } from '../config/db.js';

/**
 * Create a new parking session (entry event).
 * @param {string} slotId
 * @param {string|null} userId
 */
export async function createSession(slotId, userId = null) {
    const { data, error } = await supabaseAdmin
        .from('parking_sessions')
        .insert({
            slot_id: slotId,
            user_id: userId,
            entry_time: new Date().toISOString(),
            is_active: true,
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Find the currently active session for a given slot.
 * @param {string} slotId
 */
export async function findActiveBySlot(slotId) {
    const { data, error } = await supabaseAdmin
        .from('parking_sessions')
        .select('*')
        .eq('slot_id', slotId)
        .eq('is_active', true)
        .order('entry_time', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) throw error;
    return data;
}

/**
 * Close a parking session (exit event).
 * @param {string} sessionId
 * @param {string} exitTime
 * @param {number} amountDue
 */
export async function closeSession(sessionId, exitTime, amountDue) {
    const { data, error } = await supabaseAdmin
        .from('parking_sessions')
        .update({
            exit_time: exitTime,
            amount_due: amountDue,
            is_active: false,
        })
        .eq('id', sessionId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Find all sessions for a given user, newest first.
 * Joins slot + zone info for display.
 * @param {string} userId
 */
export async function findByUser(userId) {
    const { data, error } = await supabaseAdmin
        .from('parking_sessions')
        .select('*, parking_slots(label, sensor_id, parking_zones(name, hourly_rate))')
        .eq('user_id', userId)
        .order('entry_time', { ascending: false });

    if (error) throw error;
    return data;
}

/**
 * Find all active sessions (admin overview).
 */
export async function findAllActive() {
    const { data, error } = await supabaseAdmin
        .from('parking_sessions')
        .select('*, parking_slots(label, sensor_id, parking_zones(name)), users(full_name, sso_id)')
        .eq('is_active', true)
        .order('entry_time', { ascending: false });

    if (error) throw error;
    return data;
}
