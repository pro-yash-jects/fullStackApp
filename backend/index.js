//imports
import express from "express";
import dotenv from "dotenv"
import { connectDB } from "./config/db.js";


//initalisation
const app = express()
dotenv.config();
const env=process.env;
connectDB();

// '/' route
app.get('/', (req,res)=>{
    res.send("hello world");
})



//Listener
app.listen(env.PORT, ()=>{
    console.log("App is listening on port: ", env.PORT);
})