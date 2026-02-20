import { Router } from 'express';
import { supabaseAdmin } from '../config/db.js';
import env from '../config/env.js';
import * as SlotModel from '../models/SlotModel.js';
import * as SessionModel from '../models/SessionModel.js';
import { calculateFee } from '../services/feeCalculator.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

/**
 * GET /api/parking/slots
 * Returns all parking slots with their current status.
 */
router.get('/slots', async (_req, res, next) => {
    try {
        const slots = await SlotModel.findAll();
        res.json({ slots });
    } catch (err) {
        next(err);
    }
});

/**
 * GET /api/parking/zones
 * Returns all parking zones with aggregate availability counts.
 */
router.get('/zones', async (_req, res, next) => {
    try {
        const { data: zones, error } = await supabaseAdmin
            .from('parking_zones')
            .select('*')
            .order('name');

        if (error) throw error;

        // Get slot counts per zone
        const { data: slots } = await supabaseAdmin
            .from('parking_slots')
            .select('zone_id, status');

        const zoneSummaries = zones.map((zone) => {
            const zoneSlots = (slots || []).filter((s) => s.zone_id === zone.id);
            return {
                ...zone,
                total: zoneSlots.length,
                free: zoneSlots.filter((s) => s.status === 'free').length,
                occupied: zoneSlots.filter((s) => s.status === 'occupied').length,
                unknown: zoneSlots.filter((s) => s.status === 'unknown').length,
            };
        });

        res.json({ zones: zoneSummaries });
    } catch (err) {
        next(err);
    }
});

/**
 * POST /api/parking/sensors/update
 * Receives sensor data from the IoT simulator.
 * Expected body: { sensor_id, status, timestamp }
 * Required header: x-api-key
 */
router.post('/sensors/update', async (req, res, next) => {
    try {
        // 1. Validate sensor API key
        const apiKey = req.headers['x-api-key'];
        if (apiKey !== env.sensorApiKey) {
            return res.status(403).json({ error: 'Invalid sensor API key' });
        }

        const { sensor_id, status, timestamp } = req.body;

        if (!sensor_id || !status) {
            return res.status(400).json({ error: 'sensor_id and status are required' });
        }

        // Normalize status to lowercase (DB enum is lowercase)
        const normalizedStatus = status.toLowerCase();
        if (!['free', 'occupied', 'unknown'].includes(normalizedStatus)) {
            return res.status(400).json({ error: 'status must be free, occupied, or unknown' });
        }

        // 2. Find the slot by sensor_id
        let slot;
        try {
            slot = await SlotModel.findBySensorId(sensor_id);
        } catch {
            return res.status(404).json({ error: `No slot found for sensor: ${sensor_id}` });
        }

        const previousStatus = slot.status;

        // 3. Update slot status in DB
        if (previousStatus !== normalizedStatus) {
            await SlotModel.updateStatus(slot.id, normalizedStatus);
        }

        // 4. Handle session lifecycle
        let sessionAction = 'no_change';

        if (previousStatus === 'free' && normalizedStatus === 'occupied') {
            // Entry event — create a new parking session
            await SessionModel.createSession(slot.id);
            sessionAction = 'entry';
        } else if (previousStatus === 'occupied' && normalizedStatus === 'free') {
            // Exit event — close the active session and calculate fee
            const activeSession = await SessionModel.findActiveBySlot(slot.id);
            if (activeSession) {
                const exitTime = timestamp || new Date().toISOString();
                const hourlyRate = slot.parking_zones?.hourly_rate || 5000;
                const { totalFee } = calculateFee(
                    activeSession.entry_time,
                    exitTime,
                    hourlyRate,
                    'visitor' // Default role for anonymous sensor events
                );
                await SessionModel.closeSession(activeSession.id, exitTime, totalFee);
                sessionAction = 'exit';
            }
        }

        res.json({
            message: 'Sensor update processed',
            data: {
                sensor_id,
                status: normalizedStatus,
                previous_status: previousStatus,
                session_action: sessionAction,
                timestamp,
            },
        });
    } catch (err) {
        next(err);
    }
});

/**
 * GET /api/parking/sessions
 * Returns the authenticated user's parking sessions.
 */
router.get('/sessions', authenticate, async (req, res, next) => {
    try {
        const sessions = await SessionModel.findByUser(req.user.id);
        res.json({ sessions });
    } catch (err) {
        next(err);
    }
});

/**
 * GET /api/parking/sessions/active
 * Returns all active sessions (admin overview).
 */
router.get('/sessions/active', authenticate, async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        const sessions = await SessionModel.findAllActive();
        res.json({ sessions });
    } catch (err) {
        next(err);
    }
});

export default router;
