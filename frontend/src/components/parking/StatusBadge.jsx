import './StatusBadge.css';

/**
 * Status badge for slot availability.
 * @param {{ status: string }} props — 'free', 'occupied', or 'unknown'
 */
export default function StatusBadge({ status }) {
    const normalized = (status || 'unknown').toLowerCase();

    const labels = {
        free: 'Available',
        occupied: 'Occupied',
        unknown: 'Unknown',
    };

    return (
        <span className={`status-badge status-badge--${normalized}`}>
            {labels[normalized] || status}
        </span>
    );
}
