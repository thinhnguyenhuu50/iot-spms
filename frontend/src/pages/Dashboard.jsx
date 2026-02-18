import { useParking } from '../context/ParkingContext';
import SlotGrid from '../components/parking/SlotGrid';
import ParkingCard from '../components/parking/ParkingCard';
import Loader from '../components/common/Loader';
import './Dashboard.css';

/**
 * Dashboard page — main view showing the parking map and zone summaries.
 */
export default function Dashboard() {
    const { slots, zones, loading } = useParking();

    if (loading) {
        return <Loader size="lg" text="Loading parking data..." />;
    }

    // Compute zone summaries
    const zoneSummaries = zones.map((zone) => {
        const zoneSlots = slots.filter((s) => s.zone_id === zone.id);
        return {
            ...zone,
            total: zoneSlots.length,
            free: zoneSlots.filter((s) => s.status === 'FREE').length,
            occupied: zoneSlots.filter((s) => s.status === 'OCCUPIED').length,
        };
    });

    return (
        <div className="dashboard" id="dashboard-page">
            <header className="dashboard__header">
                <h1 className="dashboard__title">Parking Dashboard</h1>
                <p className="dashboard__subtitle">Real-time parking availability at HCMUT</p>
            </header>

            {/* Zone Cards */}
            <section className="dashboard__zones">
                {zoneSummaries.map((zone) => (
                    <ParkingCard key={zone.id} zone={zone} />
                ))}
            </section>

            {/* Detailed Slot Grid */}
            <section className="dashboard__grid-section">
                <h2 className="dashboard__section-title">All Slots</h2>
                <SlotGrid slots={slots} />
            </section>
        </div>
    );
}
