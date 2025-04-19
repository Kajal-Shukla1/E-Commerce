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
        const {code} = req.body;
        const coupon = await Coupon.findOne({code: code, userId: req.user._id, isActive: true});

        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found or inactive' });
        }

        if(coupon.expiryDate < new Date()) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(400).json({ message: 'Coupon has expired' });
        }

        res.json({
            message: 'Coupon is valid',
            code: coupon.code,
            discountPercentage: coupon.discountPercentage
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'validateCoupon error', error: error.message });

    }
}


