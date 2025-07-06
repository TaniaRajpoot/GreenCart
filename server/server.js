import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectedDB from './configs/db.js';
import connectCloudinary from './configs/cloudinary.js';

import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebHooks } from './controllers/orderController.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Connect to DB and Cloudinary
await connectedDB();
await connectCloudinary();

// CORS config for frontend origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://green-cart-4zxf.vercel.app',
  'https://green-cart-weld.vercel.app',
];

// Stripe webhook (raw body) – must come BEFORE express.json()
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebHooks);

// Middleware (applies to all routes except /stripe)
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allow cookies to be sent
  })
);

// Routes
app.get("/", (req, res) => res.send("API is working ✅"));

app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

// Start server
app.listen(port, () => {
  console.log(` Server running at http://localhost:${port}`);
});
