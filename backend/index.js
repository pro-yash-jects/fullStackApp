//imports
import express from "express";
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

//initalisation
const app = express()
app.use(express.json())

//env
dotenv.config();
const env = process.env;

//connecting db
connectDB();

app.use('/api/auth', authRoutes)

// '/' route
app.get('/', (req, res) => {
    res.send("hello world");
})

// app.use('/api/transactions', transactionRoutes)


//Listener
app.listen(env.PORT, () => {
    console.log("App is listening on port: ", env.PORT);
})