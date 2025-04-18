import Product from "../models/product.model.js";

export const getCartProducts = async (req, res) => {
    try {
        const products = await Product.find({ _id: { $in: req.user.cartItems } }); 
        
        //add quantity to each product in the cart
        const cartItems = products.map(product => {
            const cartItem = req.user.cartItems.find(item => item.productId === product._id.toString());
            return { ...product.toJSON(), quantity: cartItem ? cartItem.quantity : 0 };
        });
        res.json(cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}


export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItems.push(productId);
        }

        await user.save();
        res.json(user.cartItems);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });      
    }
};


export const removeAllFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;
        if(!productId){
            user.cartItems = [];
        }
        else{
            user.cartItems = user.cartItems.filter(item => item.id !== productId);
        }

        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const updateQuantity = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { quantity } = req.body;
        const user = req.user;
        const existingItem = user.cartItems.find(item => item.id === productId);
        
        if (existingItem) {
            if (quantity === 0) {
                user.cartItems = user.cartItems.filter(item => item.id !== productId);
                await user.save();
                return res.json(user.cartItems);
            } 
            existingItem.quantity = quantity;
            await user.save();
            return res.json(user.cartItems);
        } else {
            return res.status(404).json({ message: "Product not found in cart" });
        }

       
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
