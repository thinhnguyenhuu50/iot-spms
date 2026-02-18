import StatusBadge from './StatusBadge';
import './ParkingCard.css';

/**
 * Card showing a parking zone summary.
 * @param {{ zone: { name, free, occupied, total } }} props
 */
export default function ParkingCard({ zone }) {
    const occupancyPercent = zone.total > 0
        ? Math.round((zone.occupied / zone.total) * 100)
        : 0;

    return (
        <div className="parking-card" id={`zone-card-${zone.id}`}>
            <div className="parking-card__header">
                <h3 className="parking-card__title">{zone.name}</h3>
                <StatusBadge status={zone.free > 0 ? 'FREE' : 'OCCUPIED'} />
            </div>
            <div className="parking-card__stats">
                <div className="parking-card__stat">
                    <span className="parking-card__stat-value parking-card__stat-value--free">{zone.free}</span>
                    <span className="parking-card__stat-label">Available</span>
                </div>
                <div className="parking-card__stat">
                    <span className="parking-card__stat-value parking-card__stat-value--occupied">{zone.occupied}</span>
                    <span className="parking-card__stat-label">Occupied</span>
                </div>
                <div className="parking-card__stat">
                    <span className="parking-card__stat-value">{zone.total}</span>
                    <span className="parking-card__stat-label">Total</span>
                </div>
            </div>
            <div className="parking-card__bar">
                <div
                    className="parking-card__bar-fill"
                    style={{ width: `${occupancyPercent}%` }}
                />
            </div>
        </div>
    );
}
