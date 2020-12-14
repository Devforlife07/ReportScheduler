const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const utm_params = new Schema({
    source: String,
    medium: String,
    campaign: String,
    term: String

})
const orderSchema = new Schema({
item:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Item",
    required: true
},
coupon:String,
amount:{
    type:Number,
    required: [true,"Amount Is Required For Order"]
},
paid: {
    type: Boolean,
    default: false
},
phone:String,
email:String,
order_id: String,
payment_id:String,
utm_params: utm_params
}
,{timestamps: true});
//Custom Hooks
orderSchema.post("save",(error,doc,next)=>{
     error = error.errors
     for(property in error){
      if(property=="item"){
          if(error[property].kind=="required" && error[property].path == "item")
          {
              let err = new Error("Item is required");
              err.status = 400;
              return next(err);
          }
          else if(error[property].kind=="ObjectId" && error[property].path=="item"){
            let err = new Error("Invalid Id");
            err.status = 400;
            return next(err);
          }
      }
      else if(property=="amount"){
        if(error[property].kind=="required"){
            let err = new Error("Please Enter Amount");
            err.status = 400;
            return next(err);
        }
      }
     }
   
     next();
})
module.exports = mongoose.model("Orders",orderSchema);