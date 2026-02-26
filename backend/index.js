//imports
import express from "express";
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";
import {authenticate, authorizeAdmin} from "./middleware/authMiddleWare.js"
import cors from "cors";
//initalisation
const app = express()
app.use(express.json())
app.use(cors())

//env
dotenv.config();
const env = process.env;

//connecting db
connectDB();

app.use('/api/auth', authRoutes)
app.use('/api/stocks', stockRoutes)

// '/' route
app.get('/', authenticate,authorizeAdmin ,(req, res) => {
    res.send("hello world");
})

// app.use('/api/transactions', transactionRoutes)


//Listener
app.listen(env.PORT, () => {
    console.log("App is listening on port: ", env.PORT);
})