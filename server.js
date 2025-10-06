import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import ideaRouter from './routes/ideaRoutes.js'
import { errorHandler } from "./middleware/errorHandler.js";
import connectDB from "./config/db.js";

dotenv.config()

const app=express()
const PORT = process.env.Port || 8000

//connect to db
connectDB()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//404 fallback
app.use((req,res,next)=>{
    const error = new Error(` not found - ${req.originalUrl}`)
    res.status(404)
    next(error)
})
app.use(errorHandler)
app.use('/api/ideas',ideaRouter)

app.listen(PORT,()=>{
    console.log(`running on port ${PORT}`)
})