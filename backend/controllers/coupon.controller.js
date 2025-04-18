import Coupon from '../models/coupon.model.js';


export const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.findOne({userId: req.user._id,isActive: true});
        // if (!coupons) {
        //     return res.status(404).json({ message: 'No coupons found' });
        // }
        res.json(coupons || null);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
        
    }
}

export const validateCoupon = async (req, res) => {
    try {
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'validateCoupon error', error: error.message });
        
    }
}