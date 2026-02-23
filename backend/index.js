//imports
import express from "express";

//initalisation
const PORT = 3000
const app = express()


// '/' route
app.get('/', (req,res)=>{
    res.send("hello world");
})



//Listener
app.listen(PORT, ()=>{
    console.log("App is listening on port: ", PORT);
})