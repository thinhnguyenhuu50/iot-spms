/**
 * Transaction Model — Data Access Layer for transactions table.
 */

import { supabaseAdmin } from '../config/db.js';

/**
 * Create a new pending transaction.
 * @param {string} sessionId
 * @param {string} userId
 * @param {number} amount
 */
export async function create(sessionId, userId, amount) {
    const { data, error } = await supabaseAdmin
        .from('transactions')
        .insert({
            session_id: sessionId,
            user_id: userId,
            amount,
            status: 'pending',
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Update a transaction's status after BKPay response.
 * @param {string} id
 * @param {'success'|'failed'} status
 * @param {string|null} bkpayRef
 */
export async function updateStatus(id, status, bkpayRef = null) {
    const { data, error } = await supabaseAdmin
        .from('transactions')
        .update({ status, bkpay_ref: bkpayRef })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Find all transactions for a user, newest first.
 * Joins session + slot info for display.
 * @param {string} userId
 */
export async function findByUser(userId) {
    const { data, error } = await supabaseAdmin
        .from('transactions')
        .select('*, parking_sessions(entry_time, exit_time, parking_slots(label, parking_zones(name)))')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}
