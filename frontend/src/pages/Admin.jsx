import './Admin.css';

/**
 * Admin page — control panel for staff.
 * Shows revenue reports, sensor management, and system controls.
 */
export default function Admin() {
    return (
        <div className="admin" id="admin-page">
            <header className="admin__header">
                <h1 className="admin__title">Admin Panel</h1>
                <p className="admin__subtitle">System management and reporting</p>
            </header>

            <div className="admin__grid">
                <div className="admin__card">
                    <h3>📊 Revenue Reports</h3>
                    <p>View total revenue by zone, time period, and user role.</p>
                    <span className="admin__coming-soon">Coming Soon</span>
                </div>
                <div className="admin__card">
                    <h3>📡 Sensor Management</h3>
                    <p>Monitor sensor health, reassign sensors, and view heartbeat status.</p>
                    <span className="admin__coming-soon">Coming Soon</span>
                </div>
                <div className="admin__card">
                    <h3>👥 User Management</h3>
                    <p>Sync user data with HCMUT_DATACORE, manage roles and permissions.</p>
                    <span className="admin__coming-soon">Coming Soon</span>
                </div>
                <div className="admin__card">
                    <h3>💳 Payment Oversight</h3>
                    <p>Review BKPay transactions, handle refunds, and audit financial records.</p>
                    <span className="admin__coming-soon">Coming Soon</span>
                </div>
            </div>
        </div>
    );
}
