import { Router } from 'express';
import { supabaseAdmin } from '../config/db.js';
import { authenticate } from '../middleware/authenticate.js';
import * as TransactionModel from '../models/TransactionModel.js';

const router = Router();

/**
 * POST /api/payment/process
 * Initiates payment for a parking session via Mock BKPay.
 * Expected body: { sessionId }
 * Requires authentication.
 */
router.post('/process', authenticate, async (req, res, next) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ error: 'sessionId is required' });
        }

        // 1. Look up the parking session
        const { data: session, error: sessionError } = await supabaseAdmin
            .from('parking_sessions')
            .select('*')
            .eq('id', sessionId)
            .single();

        if (sessionError || !session) {
            return res.status(404).json({ error: 'Parking session not found' });
        }

        if (session.is_active) {
            return res.status(400).json({ error: 'Cannot pay for an active session (car still parked)' });
        }

        if (!session.amount_due || session.amount_due <= 0) {
            return res.status(400).json({ error: 'No amount due for this session' });
        }

        // 2. Create a pending transaction
        const transaction = await TransactionModel.create(
            sessionId,
            req.user.id,
            session.amount_due
        );

        // 3. Call the internal mock BKPay endpoint
        const bkpayResponse = await callMockBKPay(
            req.user.id,
            session.amount_due,
            sessionId
        );

        // 4. Update transaction status based on BKPay response
        if (bkpayResponse.status === 'SUCCESS') {
            await TransactionModel.updateStatus(
                transaction.id,
                'success',
                bkpayResponse.bkpayRef
            );
            res.json({
                message: 'Payment successful',
                transaction: {
                    id: transaction.id,
                    status: 'success',
                    bkpayRef: bkpayResponse.bkpayRef,
                    amount: session.amount_due,
                },
            });
        } else {
            await TransactionModel.updateStatus(transaction.id, 'failed');
            res.status(402).json({
                message: 'Payment failed — insufficient funds',
                transaction: {
                    id: transaction.id,
                    status: 'failed',
                    amount: session.amount_due,
                },
            });
        }
    } catch (err) {
        next(err);
    }
});

/**
 * GET /api/payment/history
 * Returns the transaction history for the authenticated user.
 */
router.get('/history', authenticate, async (req, res, next) => {
    try {
        const transactions = await TransactionModel.findByUser(req.user.id);
        res.json({ transactions });
    } catch (err) {
        next(err);
    }
});

/**
 * Internal helper: call the mock BKPay endpoint.
 * Simulates 2-second latency and random success/failure.
 */
async function callMockBKPay(userId, amount, sessionId) {
    // Simulate network latency (2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // ~80% success rate
    const isSuccess = Math.random() > 0.2;

    if (isSuccess) {
        return {
            status: 'SUCCESS',
            bkpayRef: `BKP-${Date.now()}`,
            userId,
            amount,
            sessionId,
        };
    }

    return {
        status: 'FAILED',
        message: 'Insufficient funds',
        userId,
        amount,
        sessionId,
    };
}

export default router;
