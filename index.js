import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config();


import cookieParser from 'cookie-parser';
import OrderRouter from './routes/Order.routes.js';
import UserRouter from './routes/User.routes.js';
import connectDB from './db/Connectdb.js';
import ProductRouter from './routes/Product.routes.js';

const app = express();
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use('/api/order',OrderRouter)
app.use('/api/user',UserRouter)
app.use('/api/products',ProductRouter)

const PORT=5000;

connectDB()
    .then(()=>{
        app.listen(PORT,()=>{
            console.log( `Server is running on port ${PORT}`)
        })
    })
    .catch((err)=>{
        console.error("Failed to connect to database:",err);
        process.exit(1);
    })








