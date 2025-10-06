import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ideaRouter from './routes/ideaRoutes.js';
import { errorHandler } from "./middleware/errorHandler.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000; // updated environment variable

// Connect to DB
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/ideas', ideaRouter);

// 404 fallback - should come before errorHandler
app.use((req, res, next) => {
    const error = new Error(`not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
});