import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import './Login.css';

/**
 * Login page — Mock HCMUT_SSO authentication.
 * Supports both login (email + password) and registration.
 */
export default function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ssoId, setSsoId] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email.trim() || !password.trim()) {
            setError('Email and password are required');
            return;
        }

        setLoading(true);
        try {
            const res = await client.post('/auth/login', {
                email: email.trim(),
                password: password.trim(),
            });

            login(res.data.user, res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email.trim() || !password.trim() || !ssoId.trim()) {
            setError('Email, password, and SSO ID are required');
            return;
        }

        setLoading(true);
        try {
            await client.post('/auth/register', {
                email: email.trim(),
                password: password.trim(),
                ssoId: ssoId.trim(),
                fullName: fullName.trim(),
                role: 'student',
            });

            setSuccess('Account created! You can now sign in.');
            setIsRegister(false);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
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
                    <p className="login-card__subtitle">
                        {isRegister ? 'Create your HCMUT account' : 'Sign in with your HCMUT account'}
                    </p>
                </div>

                <form onSubmit={isRegister ? handleRegister : handleLogin} className="login-card__form">
                    <Input
                        id="email-input"
                        label="Email"
                        type="email"
                        placeholder="e.g. student@hcmut.edu.vn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        id="password-input"
                        label="Password"
                        type="password"
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {isRegister && (
                        <>
                            <Input
                                id="sso-id-input"
                                label="HCMUT Student / Staff ID"
                                placeholder="e.g. 2210001"
                                value={ssoId}
                                onChange={(e) => setSsoId(e.target.value)}
                            />
                            <Input
                                id="full-name-input"
                                label="Full Name"
                                placeholder="Nguyen Van A"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                        </>
                    )}

                    {error && <div className="login-card__error">{error}</div>}
                    {success && <div className="login-card__success">{success}</div>}

                    <Button type="submit" disabled={loading} id="login-submit-btn">
                        {loading
                            ? (isRegister ? 'Creating account...' : 'Signing in...')
                            : (isRegister ? 'Create Account' : 'Login with HCMUT SSO')
                        }
                    </Button>
                </form>

                <button
                    className="login-card__toggle"
                    onClick={() => { setIsRegister(!isRegister); setError(''); setSuccess(''); }}
                    type="button"
                >
                    {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
                </button>

                <p className="login-card__footer">
                    This is a development mock of the HCMUT_SSO system.
                </p>
            </div>
        </div>
    );
}
