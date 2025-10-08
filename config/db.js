import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async (retryCount = 0) => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // If the error indicates a connection refused error and we haven't exhausted retry attempts, retry
        if (error.code === 'ECONNREFUSED' && retryCount < 5) {
            console.log('Connection refused by server. Retrying in 5 seconds...');
            setTimeout(() => connectDB(retryCount + 1), 5000);
        } else {
            process.exit(1);
        }
    }
};

export default connectDB;