import './StatusBadge.css';

/**
 * Status badge for slot availability.
 * @param {{ status: 'FREE'|'OCCUPIED'|'UNKNOWN' }} props
 */
export default function StatusBadge({ status }) {
    const labels = {
        FREE: 'Available',
        OCCUPIED: 'Occupied',
        UNKNOWN: 'Unknown',
    };

    return (
        <span className={`status-badge status-badge--${status.toLowerCase()}`}>
            {labels[status] || status}
        </span>
    );
}
