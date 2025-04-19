export const createCheckoutSession = async (req, res) => { 
    try {
        const {products, couponCode} = req.body;

        if(!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "Invalid or empty products array" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "createCheckoutSession server error" });
        
    }
 };