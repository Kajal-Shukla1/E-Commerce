import express from 'express';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';
import { adminAnalytics } from '../controllers/analytics.controller.js';

const router = express.Router();

router.get("/", protectRoute, adminRoute, adminAnalytics);

export default router;