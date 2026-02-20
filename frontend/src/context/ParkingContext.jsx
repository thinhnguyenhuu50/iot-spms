import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import client from '../api/client';
import supabase from '../api/supabase';

const ParkingContext = createContext(null);

const POLL_INTERVAL_MS = 5000; // Poll every 5 seconds

export function ParkingProvider({ children }) {
    const [slots, setSlots] = useState([]);
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const initialLoadDone = useRef(false);

    const updateSlot = useCallback((updatedSlot) => {
        setSlots((prev) =>
            prev.map((slot) => (slot.id === updatedSlot.id ? { ...slot, ...updatedSlot } : slot))
        );
    }, []);

    // Fetch data from backend (silent = don't show loading spinner)
    const fetchData = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        setError(null);
        try {
            const [slotsRes, zonesRes] = await Promise.all([
                client.get('/parking/slots'),
                client.get('/parking/zones'),
            ]);
            setSlots(slotsRes.data.slots || []);
            setZones(zonesRes.data.zones || []);
        } catch (err) {
            console.error('[ParkingContext] Failed to fetch parking data:', err);
            if (!silent) setError('Failed to load parking data');
        } finally {
            if (!silent) setLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchData(false).then(() => {
            initialLoadDone.current = true;
        });
    }, [fetchData]);

    // Polling — auto-refresh every 5 seconds after initial load
    useEffect(() => {
        const interval = setInterval(() => {
            if (initialLoadDone.current) {
                fetchData(true); // silent refresh — no loading spinner
            }
        }, POLL_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [fetchData]);

    // Subscribe to Supabase Realtime for instant slot updates (bonus speed)
    useEffect(() => {
        const channel = supabase
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
                    // Refetch zones for updated counts
                    client.get('/parking/zones').then((res) => {
                        setZones(res.data.zones || []);
                    }).catch(console.error);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [updateSlot]);

    const value = {
        slots,
        setSlots,
        zones,
        setZones,
        loading,
        setLoading,
        error,
        updateSlot,
        refetch: fetchData,
    };

    return <ParkingContext.Provider value={value}>{children}</ParkingContext.Provider>;
}

export function useParking() {
    const context = useContext(ParkingContext);
    if (!context) {
        throw new Error('useParking must be used within a ParkingProvider');
    }
    return context;
}

export default ParkingContext;

