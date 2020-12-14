const mongoose = require("mongoose");
const connectDB = async()=>{
    try {
        const connection= await mongoose.connect(process.env.MONGO_URI,{
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true
        })
        console.log("DB Connected");
    } catch (error) {
        console.log(error);
    
    }
}
module.exports = connectDB;