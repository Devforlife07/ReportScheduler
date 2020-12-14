const express = require("express");
const dotenv = require("dotenv");
dotenv.config({
    path:"./config/.env"
})
const db = require("./utils/db");
//Connecting DB
db();
const app = express();
const {scheduler} = require("./utils/scheduler")
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}))

//Routes Starts Here
app.use("/api/item",require("./routes/items"));
app.use("/api/order",require("./routes/orders"));
app.use((err,req,res,next)=>{
    if(err){
    return res.status(err.status||500).send({
        message:err.message||"Internal Server Error"
    })
    }
    next()
})
app.use("*",(req,res)=>{
    res.status(404).send({
        message:"Invalid URL.The Path Doesn't Exist"
    })
})


const PORT = process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log(`Server Is Up On Port ${PORT}`)
})
