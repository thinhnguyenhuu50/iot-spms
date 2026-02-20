import './SlotGrid.css';

/**
 * Grid view of individual parking slots.
 * Each slot changes color based on its status.
 *
 * @param {{ slots: Array<{ id, sensor_id, label, status, zone_name }> }} props
 */
export default function SlotGrid({ slots }) {
    const getSlotClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'free': return 'slot--free';
            case 'occupied': return 'slot--occupied';
            default: return 'slot--unknown';
        }
    };

    const getStatusLabel = (status) => {
        switch (status?.toLowerCase()) {
            case 'free': return 'FREE';
            case 'occupied': return 'OCCUPIED';
            default: return 'UNKNOWN';
        }
    };

    return (
        <div className="slot-grid" id="parking-slot-grid">
            {slots.map((slot) => (
                <div
                    key={slot.id}
                    className={`slot ${getSlotClass(slot.status)}`}
                    title={`${slot.label || slot.sensor_id} — ${getStatusLabel(slot.status)}`}
                    id={`slot-${slot.id}`}
                >
                    <span className="slot__id">{slot.label || slot.sensor_id}</span>
                    <span className="slot__status">{getStatusLabel(slot.status)}</span>
                </div>
            ))}
        </div>
    );
}
