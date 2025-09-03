import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

if(!process.env.MONGODB_URL){
    throw new Error("MONGODB_URL is not defined in environment variables");
}

async function connectDB() {
    try{
      await mongoose.connect(process.env.MONGODB_URL);
      console.log("Connected to MongoDB");
    }catch(err) {
        console.error("Error connecting to MongoDB:", err);
        throw err; // Re-throw the error to be handled by the caller
    }
}

export default connectDB;