import { Router } from 'express';

const router = Router();

/**
 * POST /api/auth/login
 * Mock HCMUT_SSO login — accepts a student/faculty ID and returns a JWT.
 */
router.post('/login', async (req, res, next) => {
    try {
        const { ssoId } = req.body;

        if (!ssoId) {
            return res.status(400).json({ error: 'ssoId is required' });
        }

        // TODO: Look up user in DB, generate JWT
        res.json({ message: 'Login endpoint — not yet implemented', ssoId });
    } catch (err) {
        next(err);
    }
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', (_req, res) => {
    // JWT-based auth is stateless; the client simply discards the token.
    res.json({ message: 'Logged out successfully' });
});

/**
 * GET /api/auth/me
 * Returns the current authenticated user's profile.
 */
router.get('/me', (req, res) => {
    // TODO: Extract user from JWT and return profile
    res.json({ message: 'Profile endpoint — not yet implemented' });
});

export default router;
