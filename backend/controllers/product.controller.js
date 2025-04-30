import {redis} from '../lib/redis.js';
import cloudinary from '../lib/cloudinary.js';
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

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category } = req.body;

        let cloudinaryResponse = null
      
        if(image){
          cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: "products" })
        }

        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category,
        });

        res.status(201).json(product);
    } catch (error) {
        console.log("Error creating product:", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if(!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if(product.image) {
            const publicId = product.image.split("/").pop().split(".")[0]; //this will give us the public id of the image in cloudinary
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`); //delete the image from cloudinary
                console.log("deleted image from cloudinary");
            } catch (error) {
                console.log("error in deleting image from cloudinary", error.message);
            }
        }

        await Product.findByIdAndDelete(req.params.id); //delete the product from mongodb

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log("Error deleting product:", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const getRecommendedProducts = async (req, res) => {
    try {
       const products = await Product.aggregate([
        {
            $sample: { size: 4 } // Randomly select 10 products
        },
        {
            $project: {
                _id:1,
                name: 1,
                description: 1,
                image: 1,
                price: 1
            }
        }
       ]) 

       res.json(products); // Return the recommended products as a JSON response
    } catch (error) {
        console.log("Error fetching recommended products:", error.message);
        res.status(500).json({ message: error.message });
        
    }
}

export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category });
        res.json({products});
    } catch (error) {
        console.log("Error fetching products by category:", error.message);
        res.status(500).json({ message: error.message });
        
    }
}

export const toggleFeaturedProduct = async (req, res) => {
    try {
       const product = await Product.findById(req.params.id);
       if(product) {
        product.isFeatured = !product.isFeatured; 
        const updatedProduct = await product.save(); 
        await updateFeaturedProductsCache();
        res.json(updatedProduct);
        } else{
            return res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.log("Error toggling featured product:", error.message);
        res.status(500).json({ message: error.message });       
    }
}

async function updateFeaturedProductsCache() {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean();
        await redis.set("featured_products", JSON.stringify(featuredProducts));
    } catch (error) {
        console.log("Error updating featured products cache:", error.message);
    }
}
