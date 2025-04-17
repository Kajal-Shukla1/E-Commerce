import redis from 'ioredis';
import Product from '../models/product.model.js';
import mongoose from 'mongoose';

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({products});
    } catch (error) {
        console.log("Error fetching products:", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const getFeaturedProducts = async (req, res) => {
    try {
        let featureProducts = await redis.get("featured_products")
        if(featureProducts){
            return res.json(JSON.parse(featureProducts))    
        }

        //if not in redis, fetch from mongodb
        // .lean() is used to return plain javascript objects instead of mongoose documents ,this is useful for performance
        featureProducts = await Product.find({isFeatured: true}).lean();

        if(!featureProducts || featureProducts.length === 0) {
            return res.status(404).json({ message: "No featured products found" });
        }

        //store in redis for future quick access
        await redis.set("featured_products", JSON.stringify(featureProducts));
        res.json(featureProducts); 

    } catch (error) {
        console.log("Error fetching featured products:", error.message);
        res.status(500).json({ message: error.message });       
    }
}

