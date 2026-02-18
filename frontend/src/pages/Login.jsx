import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import './Login.css';

/**
 * Login page — Mock HCMUT_SSO authentication.
 */
export default function Login() {
    const [ssoId, setSsoId] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!ssoId.trim()) {
            setError('Please enter your HCMUT Student/Staff ID');
            return;
        }

        setLoading(true);

        try {
            // TODO: Call /api/auth/login with ssoId
            // For now, mock the login
            const mockUser = {
                id: '1',
                ssoId: ssoId.trim(),
                name: `User ${ssoId.trim()}`,
                role: 'student',
            };
            const mockToken = 'mock-jwt-token-' + Date.now();

            login(mockUser, mockToken);
            navigate('/');
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page" id="login-page">
            <div className="login-card">
                <div className="login-card__header">
                    <span className="login-card__logo">🅿️</span>
                    <h1 className="login-card__title">Welcome to IoT-SPMS</h1>
                    <p className="login-card__subtitle">Sign in with your HCMUT account</p>
                </div>

                <form onSubmit={handleSubmit} className="login-card__form">
                    <Input
                        id="sso-id-input"
                        label="HCMUT Student / Staff ID"
                        placeholder="e.g. 2210001"
                        value={ssoId}
                        onChange={(e) => setSsoId(e.target.value)}
                        error={error}
                    />

                    <Button type="submit" disabled={loading} id="login-submit-btn">
                        {loading ? 'Signing in...' : 'Login with HCMUT SSO'}
                    </Button>
                </form>

                <p className="login-card__footer">
                    This is a development mock of the HCMUT_SSO system.
                </p>
            </div>
        </div>
    );
}
