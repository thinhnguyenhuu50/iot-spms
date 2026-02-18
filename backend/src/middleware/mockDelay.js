/**
 * Mock Delay Middleware
 *
 * Artificially slows down responses to test frontend loading states.
 * Only active in development mode.
 *
 * Usage: router.use(mockDelay(1000))  // 1 second delay
 */

import env from '../config/env.js';

export function mockDelay(ms = 500) {
    return async (_req, _res, next) => {
        if (env.nodeEnv === 'development') {
            await new Promise((resolve) => setTimeout(resolve, ms));
        }
        next();
    };
}
