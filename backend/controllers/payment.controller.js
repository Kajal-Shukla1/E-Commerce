import Coupon from "../models/coupon.model.js";
import { stripe } from "../lib/stripe.js";
import Order from "../models/order.model.js";

export const createCheckoutSession = async (req, res) => { 
    try {
        const {products, couponCode} = req.body;

        if(!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Invalid or empty products array" });
        }

        let totalAmount = 0;
        
        const lineItems = products.map((product) => {
            const amount = Math.round(product.price * 100); // Convert to cents as Stripe uses cents
            totalAmount += amount * product.quantity; 

            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                        images: [product.image],
                    },
                    unit_amount: amount,
                },
            };
        });

        let coupon = null;
        if(couponCode) {
            coupon = await Coupon.findOne({ code: couponCode,userId : req.user._id, isActive: true });
            if(coupon) {
                totalAmount -= Math.round(totalAmount * coupon.discountPercentage / 100); // Apply discount

            }
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], //add other type like paypal
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:  `${process.env.CLIENT_URL}/purchase-cancel`,
            discounts: coupon ?
            [
                {
                    coupon: await createStripeCoupon(coupon.discountPercentage),
                },
            ] 
            : [],
            metadata: {
                userId: req.user._id.toString(),
                couponCode: couponCode || "",
                products: JSON.stringify(
                    products.map((product) => ({
                        id: product.id,
                        name: product.name, 
                        quantity: product.quantity,
                        price: product.price,
                    })),
                )
            },
        });

        if(totalAmount >= 20000){
            await createNewCoupon(req.user._id.toString());
        }

        res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 }); // Convert back to dollars for the response

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "createCheckoutSession server error" });
        
    }
 };

 async function createStripeCoupon(discountPercentage) {
    try {
        const coupon = await stripe.coupons.create({
            percent_off: discountPercentage,
            duration: 'once',
        });
        return coupon.id;
    } catch (error) {
        console.error("Error creating Stripe coupon:", error);
        throw new Error("Failed to create Stripe coupon");
        
    }
 }

async function createNewCoupon(userId) {
    const newCoupon = new Coupon({
        code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountPercentage: 10,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        userId: userId,
    });
}

export const checkoutSuccess = async (req, res) => {
    try {
        const {sessionId} = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if(session.payment_status === 'paid') {
            if(session.metadata.couponCode) {
                 await Coupon.findOneAndUpdate({
                    code: session.metadata.couponCode,
                    userId: session.metadata.userId,
                }, {
                     isActive: false 
                })
            }
            
            const products = JSON.parse(session.metadata.products);
            const newOrder = new Order({
                user: session.metadata.userId,
                products: products.map((product) => ({
                    id: product.id,
                    quantity: product.quantity,
                    price: product.price,
                })),
                totalAmount: session.amount_total / 100, // Convert back to dollars
                stripeSessionId: sessionId,
            });

            await newOrder.save();
            res.status(200).json({ success:true, message: "Order created successfully", orderId: newOrder._id });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "checkoutSuccess server error" });
        
    }
}

