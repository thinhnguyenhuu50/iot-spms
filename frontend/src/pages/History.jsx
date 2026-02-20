import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import { formatDate, formatCurrency } from '../utils/formatters';
import './History.css';

/**
 * History page — shows parking sessions and payment transactions.
 */
export default function History() {
    const { isAuthenticated } = useAuth();
    const [sessions, setSessions] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [payingId, setPayingId] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchData();
    }, [isAuthenticated]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [sessRes, txRes] = await Promise.all([
                client.get('/parking/sessions'),
                client.get('/payment/history'),
            ]);
            setSessions(sessRes.data.sessions || []);
            setTransactions(txRes.data.transactions || []);
        } catch (err) {
            console.error('Failed to fetch history:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async (sessionId) => {
        setPayingId(sessionId);
        setToast(null);
        try {
            const res = await client.post('/payment/process', { sessionId });
            setToast({ type: 'success', message: `Payment successful! Ref: ${res.data.transaction.bkpayRef}` });
            fetchData(); // Refresh
        } catch (err) {
            const msg = err.response?.data?.message || 'Payment failed';
            setToast({ type: 'error', message: msg });
        } finally {
            setPayingId(null);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="history" id="history-page">
                <div className="history__empty">
                    <p>Please <a href="/login">log in</a> to view your parking history.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return <Loader size="lg" text="Loading your history..." />;
    }

    // Determine which sessions have been paid
    const paidSessionIds = new Set(
        transactions.filter((t) => t.status === 'success').map((t) => t.session_id)
    );

    return (
        <div className="history" id="history-page">
            <header className="history__header">
                <h1 className="history__title">My Parking History</h1>
                <p className="history__subtitle">View your sessions and payment records</p>
            </header>

            {/* Toast notification */}
            {toast && (
                <div className={`history__toast history__toast--${toast.type}`}>
                    {toast.message}
                    <button className="history__toast-close" onClick={() => setToast(null)}>×</button>
                </div>
            )}

            {/* Sessions Section */}
            <section className="history__section">
                <h2 className="history__section-title">Parking Sessions</h2>
                {sessions.length === 0 ? (
                    <p className="history__empty-text">No parking sessions yet.</p>
                ) : (
                    <div className="history__table-wrap">
                        <table className="history__table" id="sessions-table">
                            <thead>
                                <tr>
                                    <th>Slot</th>
                                    <th>Zone</th>
                                    <th>Entry</th>
                                    <th>Exit</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sessions.map((s) => {
                                    const slotLabel = s.parking_slots?.label || '—';
                                    const zoneName = s.parking_slots?.parking_zones?.name || '—';
                                    const isPaid = paidSessionIds.has(s.id);
                                    const canPay = !s.is_active && s.amount_due > 0 && !isPaid;

                                    return (
                                        <tr key={s.id}>
                                            <td>{slotLabel}</td>
                                            <td>{zoneName}</td>
                                            <td>{formatDate(s.entry_time)}</td>
                                            <td>{s.exit_time ? formatDate(s.exit_time) : <span className="history__active">Parked</span>}</td>
                                            <td>{s.amount_due > 0 ? formatCurrency(s.amount_due) : '—'}</td>
                                            <td>
                                                {s.is_active ? (
                                                    <span className="history__badge history__badge--active">Active</span>
                                                ) : isPaid ? (
                                                    <span className="history__badge history__badge--paid">Paid</span>
                                                ) : (
                                                    <span className="history__badge history__badge--unpaid">Unpaid</span>
                                                )}
                                            </td>
                                            <td>
                                                {canPay && (
                                                    <Button
                                                        variant="primary"
                                                        className="history__pay-btn"
                                                        disabled={payingId === s.id}
                                                        onClick={() => handlePay(s.id)}
                                                        id={`pay-btn-${s.id}`}
                                                    >
                                                        {payingId === s.id ? 'Processing...' : 'Pay Now'}
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* Transactions Section */}
            <section className="history__section">
                <h2 className="history__section-title">Payment Transactions</h2>
                {transactions.length === 0 ? (
                    <p className="history__empty-text">No transactions yet.</p>
                ) : (
                    <div className="history__table-wrap">
                        <table className="history__table" id="transactions-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>BKPay Ref</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((t) => (
                                    <tr key={t.id}>
                                        <td>{formatDate(t.created_at)}</td>
                                        <td>{formatCurrency(t.amount)}</td>
                                        <td>{t.bkpay_ref || '—'}</td>
                                        <td>
                                            <span className={`history__badge history__badge--${t.status}`}>
                                                {t.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}
