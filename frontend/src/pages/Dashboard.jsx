import { useParking } from '../context/ParkingContext';
import SlotGrid from '../components/parking/SlotGrid';
import ParkingCard from '../components/parking/ParkingCard';
import Loader from '../components/common/Loader';
import './Dashboard.css';

/**
 * Dashboard page — main view showing the parking map and zone summaries.
 */
export default function Dashboard() {
    const { slots, zones, loading, error } = useParking();

    if (loading) {
        return <Loader size="lg" text="Loading parking data..." />;
    }

    if (error) {
        return (
            <div className="dashboard" id="dashboard-page">
                <div className="dashboard__error">
                    <p>⚠️ {error}</p>
                    <p>Make sure the backend server is running on port 5000.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard" id="dashboard-page">
            <header className="dashboard__header">
                <h1 className="dashboard__title">Parking Dashboard</h1>
                <p className="dashboard__subtitle">Real-time parking availability at HCMUT</p>
                <div className="dashboard__legend">
                    <span className="dashboard__legend-item dashboard__legend-item--free">● Available</span>
                    <span className="dashboard__legend-item dashboard__legend-item--occupied">● Occupied</span>
                    <span className="dashboard__legend-item dashboard__legend-item--unknown">● Unknown</span>
                </div>
            </header>

            {/* Zone Cards */}
            <section className="dashboard__zones">
                {zones.map((zone) => (
                    <ParkingCard key={zone.id} zone={zone} />
                ))}
            </section>

            {/* Detailed Slot Grid */}
            <section className="dashboard__grid-section">
                <h2 className="dashboard__section-title">All Slots</h2>
                {slots.length === 0 ? (
                    <p className="dashboard__empty">No parking slots configured. Run the seed SQL script.</p>
                ) : (
                    <SlotGrid slots={slots} />
                )}
            </section>
        </div>
    );
}
