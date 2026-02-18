/**
 * Monitor Service
 *
 * Aggregates sensor data for dashboard views.
 */

/**
 * Count free slots in a given zone.
 * @param {Array} slots - Array of slot objects { id, zone_id, status }.
 * @param {string} zoneId - The zone to filter by.
 * @returns {{ total: number, free: number, occupied: number, unknown: number }}
 */
export function getZoneAvailability(slots, zoneId) {
    const zoneSlots = slots.filter((s) => s.zone_id === zoneId);

    return {
        total: zoneSlots.length,
        free: zoneSlots.filter((s) => s.status === 'FREE').length,
        occupied: zoneSlots.filter((s) => s.status === 'OCCUPIED').length,
        unknown: zoneSlots.filter((s) => s.status === 'UNKNOWN').length,
    };
}

/**
 * Check for stale sensors (heartbeat protocol).
 * If a sensor hasn't reported in `thresholdMs`, mark its slot as UNKNOWN.
 * @param {Array} slots - Array of slot objects with `last_updated` timestamps.
 * @param {number} thresholdMs - Staleness threshold in milliseconds (default: 5 minutes).
 * @returns {Array} Slots that are now considered stale.
 */
export function detectStaleSlots(slots, thresholdMs = 5 * 60 * 1000) {
    const now = Date.now();
    return slots.filter((slot) => {
        const lastUpdate = new Date(slot.last_updated).getTime();
        return now - lastUpdate > thresholdMs;
    });
}
