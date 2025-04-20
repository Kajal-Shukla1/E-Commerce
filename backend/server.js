//const express = require('express');
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; 

import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';
import analyticsRoutes from './routes/analytics.route.js';
import { connectDB } from './lib/db.js';

dotenv.config();
const PORT = process.env.PORT ;
const app = express();

app.use(express.json()); // Parse JSON bodies (as sent by API clients)
app.use(cookieParser()); // Parse cookies from the request headers


app.use("/api/auth" ,  authRoutes);
app.use("/api/products" ,  productRoutes);
app.use("/api/cart" ,  cartRoutes);
app.use("/api/coupons" ,  couponRoutes);
app.use("/api/payments" ,  paymentRoutes);
app.use("/api/analytics", analyticsRoutes)


app.listen(PORT, () => {
  console.log('Server is running on http://localhost:' + PORT); 

  connectDB();
});

// Ffp3uIBMMJmWrVyl