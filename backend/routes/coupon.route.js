import express from 'express';

import { createCoupon, validateCoupon,deleteCoupon, getAllCoupons } from '../controllers/coupon.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/validate', protectRoute, validateCoupon);
router.get('/',protectRoute, getAllCoupons);  


export default router;

