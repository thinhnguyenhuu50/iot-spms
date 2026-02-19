import { Router } from 'express';
import supabase from '../config/db.js';
import { supabaseAdmin } from '../config/db.js';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user via Supabase Auth.
 * Metadata (sso_id, role, full_name) is passed to the signup and
 * the database trigger auto-creates a row in public.users.
 */
router.post('/register', async (req, res, next) => {
    try {
        const { email, password, ssoId, role, fullName } = req.body;

        if (!email || !password || !ssoId) {
            return res.status(400).json({
                error: 'email, password, and ssoId are required',
            });
        }

        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // auto-confirm for dev
            user_metadata: {
                sso_id: ssoId,
                role: role || 'student',
                full_name: fullName || '',
            },
        });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: data.user.id,
                email: data.user.email,
                ssoId,
                role: role || 'student',
                fullName: fullName || '',
            },
        });
    } catch (err) {
        next(err);
    }
});

/**
 * POST /api/auth/login
 * Mock HCMUT_SSO login — signs in with email/password via Supabase Auth
 * and returns the session token + user profile.
 */
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'email and password are required' });
        }

        // Sign in via Supabase Auth
        const { data: authData, error: authError } =
            await supabase.auth.signInWithPassword({ email, password });

        if (authError) {
            return res.status(401).json({ error: authError.message });
        }

        // Fetch the user's profile from public.users
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (profileError) {
            return res.status(500).json({ error: 'Failed to fetch user profile' });
        }

        res.json({
            token: authData.session.access_token,
            refreshToken: authData.session.refresh_token,
            user: {
                id: profile.id,
                email: profile.email,
                ssoId: profile.sso_id,
                role: profile.role,
                fullName: profile.full_name,
                licensePlate: profile.license_plate,
                balance: profile.balance,
            },
        });
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
 * Requires a valid Bearer token in the Authorization header.
 */
router.get('/me', async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or invalid Authorization header' });
        }

        const token = authHeader.split(' ')[1];

        // Verify the token with Supabase Auth
        const { data: { user }, error: authError } =
            await supabase.auth.getUser(token);

        if (authError || !user) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // Fetch the full profile from public.users
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError) {
            return res.status(500).json({ error: 'Failed to fetch user profile' });
        }

        res.json({
            id: profile.id,
            email: profile.email,
            ssoId: profile.sso_id,
            role: profile.role,
            fullName: profile.full_name,
            licensePlate: profile.license_plate,
            balance: profile.balance,
        });
    } catch (err) {
        next(err);
    }
});

export default router;
