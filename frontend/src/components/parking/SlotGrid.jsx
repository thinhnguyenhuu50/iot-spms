import './SlotGrid.css';

/**
 * Grid view of individual parking slots.
 * Each slot changes color based on its status.
 *
 * @param {{ slots: Array<{ id, sensor_id, status, zone_name }> }} props
 */
export default function SlotGrid({ slots }) {
    const getSlotClass = (status) => {
        switch (status) {
            case 'FREE': return 'slot--free';
            case 'OCCUPIED': return 'slot--occupied';
            default: return 'slot--unknown';
        }
    };

    return (
        <div className="slot-grid" id="parking-slot-grid">
            {slots.map((slot) => (
                <div
                    key={slot.id}
                    className={`slot ${getSlotClass(slot.status)}`}
                    title={`${slot.sensor_id} — ${slot.status}`}
                    id={`slot-${slot.id}`}
                >
                    <span className="slot__id">{slot.sensor_id}</span>
                    <span className="slot__status">{slot.status}</span>
                </div>
            ))}
        </div>
    );
}
