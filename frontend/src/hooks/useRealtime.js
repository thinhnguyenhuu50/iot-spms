/**
 * useRealtime Hook
 *
 * Encapsulates the logic for connecting to Supabase Realtime channels
 * and updating the ParkingContext when slot data changes.
 */

import { useEffect } from 'react';
import { useParking } from '../context/ParkingContext';

/**
 * Subscribe to real-time parking slot updates.
 * @param {object} supabaseClient - Initialized Supabase client.
 */
export function useRealtime(supabaseClient) {
    const { updateSlot } = useParking();

    useEffect(() => {
        if (!supabaseClient) return;

        const channel = supabaseClient
            .channel('parking-slots-changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'parking_slots',
                },
                (payload) => {
                    console.log('[Realtime] Slot updated:', payload.new);
                    updateSlot(payload.new);
                }
            )
            .subscribe();

        return () => {
            supabaseClient.removeChannel(channel);
        };
    }, [supabaseClient, updateSlot]);
}
