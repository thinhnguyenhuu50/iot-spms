/**
 * Authentication Middleware
 *
 * Verifies the Supabase Auth JWT token from the Authorization header.
 * Fetches the user's profile from public.users and attaches it to `req.user`.
 */

import supabase from '../config/db.js';
import { supabaseAdmin } from '../config/db.js';

/**
 * Authenticate — verifies the Bearer token via Supabase Auth
 * and attaches the full user profile to req.user.
 */
export async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify token with Supabase Auth
        const { data: { user }, error: authError } =
            await supabase.auth.getUser(token);

        if (authError || !user) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        // Fetch the full profile from public.users (using admin to bypass RLS)
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError || !profile) {
            return res.status(401).json({ error: 'User profile not found' });
        }

        // Attach to request
        req.user = {
            id: profile.id,
            email: profile.email,
            ssoId: profile.sso_id,
            role: profile.role,
            fullName: profile.full_name,
            licensePlate: profile.license_plate,
            balance: profile.balance,
        };

        next();
    } catch (err) {
        return res.status(401).json({ error: 'Authentication failed' });
    }
}

/**
 * Role-based authorization middleware factory.
 * Usage: authorize('admin', 'staff')
 */
export function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }

        next();
    };
}
