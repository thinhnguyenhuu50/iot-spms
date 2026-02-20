import { useParking } from '../context/ParkingContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatters';
import Loader from '../components/common/Loader';
import './Admin.css';

/**
 * Admin page — control panel for staff.
 * Shows zone stats, occupancy overview, and system info.
 */
export default function Admin() {
    const { zones, slots, loading } = useParking();
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="admin" id="admin-page">
                <div className="admin__empty">
                    <p>Please <a href="/login">log in</a> to access the admin panel.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return <Loader size="lg" text="Loading admin data..." />;
    }

    // Compute totals
    const totalSlots = slots.length;
    const totalFree = slots.filter((s) => s.status === 'free').length;
    const totalOccupied = slots.filter((s) => s.status === 'occupied').length;
    const occupancyRate = totalSlots > 0 ? Math.round((totalOccupied / totalSlots) * 100) : 0;

    return (
        <div className="admin" id="admin-page">
            <header className="admin__header">
                <h1 className="admin__title">Admin Panel</h1>
                <p className="admin__subtitle">System management and reporting</p>
            </header>

            {/* Overview Stats */}
            <div className="admin__stats">
                <div className="admin__stat-card">
                    <span className="admin__stat-value admin__stat-value--primary">{totalSlots}</span>
                    <span className="admin__stat-label">Total Slots</span>
                </div>
                <div className="admin__stat-card">
                    <span className="admin__stat-value admin__stat-value--free">{totalFree}</span>
                    <span className="admin__stat-label">Available</span>
                </div>
                <div className="admin__stat-card">
                    <span className="admin__stat-value admin__stat-value--occupied">{totalOccupied}</span>
                    <span className="admin__stat-label">Occupied</span>
                </div>
                <div className="admin__stat-card">
                    <span className="admin__stat-value">{occupancyRate}%</span>
                    <span className="admin__stat-label">Occupancy</span>
                </div>
            </div>

            {/* Zone Breakdown */}
            <section className="admin__section">
                <h2 className="admin__section-title">Zone Breakdown</h2>
                <div className="admin__grid">
                    {zones.map((zone) => (
                        <div className="admin__card" key={zone.id}>
                            <h3>{zone.name}</h3>
                            <p className="admin__card-desc">{zone.description || 'No description'}</p>
                            <div className="admin__card-stats">
                                <span className="admin__card-stat">
                                    <strong className="admin__stat--free">{zone.free}</strong> free
                                </span>
                                <span className="admin__card-stat">
                                    <strong className="admin__stat--occupied">{zone.occupied}</strong> occupied
                                </span>
                                <span className="admin__card-stat">
                                    <strong>{zone.total}</strong> total
                                </span>
                            </div>
                            <div className="admin__card-rate">
                                Rate: {formatCurrency(zone.hourly_rate)}/hr
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* System Info */}
            <section className="admin__section">
                <h2 className="admin__section-title">System Status</h2>
                <div className="admin__grid">
                    <div className="admin__card">
                        <h3>📡 Sensor Network</h3>
                        <p>{totalSlots} sensors registered across {zones.length} zones</p>
                        <span className="admin__status-badge admin__status-badge--ok">Online</span>
                    </div>
                    <div className="admin__card">
                        <h3>💳 BKPay Gateway</h3>
                        <p>Mock payment gateway with ~80% success rate</p>
                        <span className="admin__status-badge admin__status-badge--ok">Active</span>
                    </div>
                    <div className="admin__card">
                        <h3>🔐 HCMUT SSO</h3>
                        <p>Mock authentication with Supabase Auth</p>
                        <span className="admin__status-badge admin__status-badge--ok">Active</span>
                    </div>
                </div>
            </section>
        </div>
    );
}
