import { Router } from 'express';

const router = Router();

/**
 * GET /api/parking/slots
 * Returns all parking slots with their current status.
 */
router.get('/slots', async (_req, res, next) => {
    try {
        // TODO: Fetch slots from SlotModel
        res.json({ message: 'Slots endpoint — not yet implemented', slots: [] });
    } catch (err) {
        next(err);
    }
});

/**
 * GET /api/parking/zones
 * Returns all parking zones with aggregate availability.
 */
router.get('/zones', async (_req, res, next) => {
    try {
        // TODO: Fetch zones with slot counts from DB
        res.json({ message: 'Zones endpoint — not yet implemented', zones: [] });
    } catch (err) {
        next(err);
    }
});

/**
 * POST /api/parking/sensors/update
 * Receives sensor data from the IoT simulator.
 * Expected body: { sensor_id, status, timestamp }
 */
router.post('/sensors/update', async (req, res, next) => {
    try {
        const { sensor_id, status, timestamp } = req.body;

        if (!sensor_id || !status) {
            return res.status(400).json({ error: 'sensor_id and status are required' });
        }

        // TODO:
        // 1. Validate sensor API key (from x-api-key header)
        // 2. Update slot status in DB
        // 3. If FREE -> OCCUPIED: create parking_session (entry event)
        // 4. If OCCUPIED -> FREE: close parking_session (exit event), calculate fee

        res.json({
            message: 'Sensor update received',
            data: { sensor_id, status, timestamp },
        });
    } catch (err) {
        next(err);
    }
});

export default router;
