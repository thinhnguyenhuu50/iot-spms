import { Router } from 'express';

const router = Router();

/**
 * POST /api/mock/bkpay
 * Simulates the BKPay university payment gateway.
 * - Introduces a 2-second delay to mimic network latency.
 * - Randomly returns success (200) or failure (402) to test error handling.
 *
 * Expected body: { userId, amount, sessionId }
 */
router.post('/bkpay', async (req, res) => {
    const { userId, amount, sessionId } = req.body;

    // Simulate network latency (2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // ~80% chance of success, ~20% chance of insufficient funds
    const isSuccess = Math.random() > 0.2;

    if (isSuccess) {
        return res.status(200).json({
            status: 'SUCCESS',
            message: 'Payment processed successfully',
            bkpayRef: `BKP-${Date.now()}`,
            userId,
            amount,
            sessionId,
        });
    }

    return res.status(402).json({
        status: 'FAILED',
        message: 'Insufficient funds',
        userId,
        amount,
        sessionId,
    });
});

export default router;
