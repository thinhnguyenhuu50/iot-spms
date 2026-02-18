import { Router } from 'express';

const router = Router();

/**
 * POST /api/payment/process
 * Initiates payment for a parking session via Mock BKPay.
 * Expected body: { sessionId }
 */
router.post('/process', async (req, res, next) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ error: 'sessionId is required' });
        }

        // TODO:
        // 1. Look up parking session and amount_due
        // 2. Call mock BKPay endpoint
        // 3. Record transaction result
        res.json({ message: 'Payment endpoint — not yet implemented', sessionId });
    } catch (err) {
        next(err);
    }
});

/**
 * GET /api/payment/history
 * Returns the transaction history for the authenticated user.
 */
router.get('/history', async (_req, res, next) => {
    try {
        // TODO: Fetch transactions for the current user
        res.json({ message: 'Payment history — not yet implemented', transactions: [] });
    } catch (err) {
        next(err);
    }
});

export default router;
