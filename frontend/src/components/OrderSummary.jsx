import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import {  MoveRight } from "lucide-react";
import { Link } from "react-router-dom";
import {loadStripe} from "@stripe/stripe-js"
import axios from "../lib/axios";

const stripePromise = loadStripe("pk_test_51RFfKQ2LeyQaU6c8794dZYzGYhmDdquWoxBMcVpzEAiyXXGCRMcQ5CxDnKHq6RPZUTynEXoq2pxoe1s0OOKtl4Mi00UscbEnx9")

const OrderSummary = () => {
    const {total,subtotal,coupon, isCouponApplied,cart } = useCartStore();

    const savings = subtotal - total;
    const formattedSubtotal = subtotal.toFixed(2);
    const formattedTotal = total.toFixed(2);            
    const formattedSavings = savings.toFixed(2);

    const handlePayment = async() => {
        const stripe = await stripePromise;
        const res = await axios.post("/payments/create-checkout-session", {
            products: cart,           
            couponCode: coupon ? coupon.code :null, 
        });

        const session = res.data;
        const result = await stripe.redirectToCheckout({
            sessionId : session.id,
        });

        if(result.error){
            console.log("Error:", result.error);
        }
    };

  return (
    <motion.div
       className='space-y-4 rounded-lg border border-gray-700  bg-gray-800 p-4 shadow-sm sm:p-6'
       initial={{opacity:0, y:20}}
       animate={{opacity:1,y:0}}
       transition={{duration:0.5}}
    >
        <p className="text-xl font-semibold text-emerald-400">Order Summary</p>

        <div className="space-y-4">
            <div className="space-y-2">
                <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-300">Original Price</dt>
                    <dt className="text-base font-medium text-white">₹{formattedSubtotal}</dt>
                </dl>

                {savings  > 0 && (
                    <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-300">Savings</dt>
                        <dt className="text-base font-medium text-emerald-400">₹{formattedSavings}</dt>
                    </dl>
                )}

                {coupon && isCouponApplied && (
                    <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-300">Coupon ({coupon.code})</dt>
                        <dt className="text-base font-medium text-emerald-400">-{coupon.discountPercentage}%</dt>
                    </dl>
                )}

                <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
                    <dt className="text-base font-bold text-white">Total</dt>
                    <dd className="text-base font-bold text-emerald-400">₹{formattedTotal}</dd>
                </dl>
            </div>

            <motion.div
              className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium
              text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 cursor-pointer"
              whiteHover={{scale:1.05}}
              whileTap={{scale:0.95}}
              onClick={handlePayment}
            >
                Proceed to Checkout
            </motion.div>

            <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-normal text-gray-400">or</span>
                <Link
                  to='/'
                  className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline
                  hover:text-emerald-300 hover:no-underline"
                >
                Continue Shopping
                <MoveRight size={16}/>
                </Link>
            </div>
        </div>
    </motion.div>
  )
};

export default OrderSummary;