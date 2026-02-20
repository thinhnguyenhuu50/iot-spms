import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar" id="main-navbar">
            <div className="navbar__brand">
                <span className="navbar__logo">🅿️</span>
                <Link to="/" className="navbar__title">IoT-SPMS</Link>
            </div>

            <div className="navbar__links">
                <Link to="/" className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`}>
                    Dashboard
                </Link>
                {isAuthenticated && (
                    <Link to="/history" className={`navbar__link ${isActive('/history') ? 'navbar__link--active' : ''}`}>
                        My History
                    </Link>
                )}
                {isAuthenticated && (
                    <Link to="/admin" className={`navbar__link ${isActive('/admin') ? 'navbar__link--active' : ''}`}>
                        Admin
                    </Link>
                )}
            </div>

            <div className="navbar__actions">
                {isAuthenticated ? (
                    <>
                        <span className="navbar__user">{user?.fullName || user?.ssoId || user?.email}</span>
                        <button className="navbar__logout" onClick={logout} id="logout-btn">
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login" className="navbar__login" id="login-link">
                        Login with HCMUT SSO
                    </Link>
                )}
            </div>
        </nav>
    );
}
