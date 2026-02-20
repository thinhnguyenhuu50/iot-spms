/**
 * Slot Model — Data Access Layer for parking_slots table.
 */

import { supabaseAdmin as supabase } from '../config/db.js';

/**
 * Fetch all parking slots.
 */
export async function findAll() {
    const { data, error } = await supabase
        .from('parking_slots')
        .select('*, parking_zones(name, hourly_rate)');

    if (error) throw error;
    return data;
}

/**
 * Find a single slot by its ID.
 */
export async function findById(id) {
    const { data, error } = await supabase
        .from('parking_slots')
        .select('*, parking_zones(name, hourly_rate)')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

/**
 * Find a slot by its sensor_id.
 */
export async function findBySensorId(sensorId) {
    const { data, error } = await supabase
        .from('parking_slots')
        .select('*, parking_zones(name, hourly_rate)')
        .eq('sensor_id', sensorId)
        .single();

    if (error) throw error;
    return data;
}

/**
 * Update a slot's status.
 */
export async function updateStatus(id, status) {
    const { data, error } = await supabase
        .from('parking_slots')
        .update({ status, last_updated: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}
