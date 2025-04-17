//const express = require('express');
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; 

import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import { connectDB } from './lib/db.js';

dotenv.config();
const PORT = process.env.PORT ;
const app = express();

app.use(express.json()); // Parse JSON bodies (as sent by API clients)
app.use(cookieParser()); // Parse cookies from the request headers


app.use("/api/auth" ,  authRoutes);
app.use("/api/products" ,  productRoutes);


app.listen(PORT, () => {
  console.log('Server is running on http://localhost:' + PORT); 

  connectDB();
});

// Ffp3uIBMMJmWrVyl