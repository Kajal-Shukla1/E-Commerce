import express from 'express';

import { validateCoupon, getAllCoupons } from '../controllers/coupon.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/validate', protectRoute, validateCoupon);
router.get('/',protectRoute, getAllCoupons);  


export default router;

