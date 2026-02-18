import { Router } from 'express';

const router = Router();

// --------------- Auth Routes ---------------
// POST /api/auth/login
// POST /api/auth/logout
// GET  /api/auth/me
import authController from '../controllers/authController.js';
router.use('/auth', authController);

// --------------- Parking Routes ---------------
// GET  /api/parking/slots
// GET  /api/parking/zones
// POST /api/sensors/update
import parkingController from '../controllers/parkingController.js';
router.use('/parking', parkingController);

// --------------- Payment Routes ---------------
// POST /api/payment/process
// GET  /api/payment/history
import paymentController from '../controllers/paymentController.js';
router.use('/payment', paymentController);

// --------------- Mock Services ---------------
// POST /api/mock/bkpay
import mockController from '../controllers/mockController.js';
router.use('/mock', mockController);

export default router;
