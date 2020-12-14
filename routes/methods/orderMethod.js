const Orders = require("../../models/orders");
const {checkItem} = require("../../utils/helper")
exports.addOrder = async(req,res,next)=>{
    const {item,coupon,amount,paid,phone,email,utm_params,order_id,payment_id} = req.body
    const check =await checkItem(item);
    if(!check){
        let err = new Error("No Such Item Found");
        err.status = 404;
        return next(err);
    }
    const newOrder = new Orders({item   ,coupon,amount,paid,phone,email,utm_params,order_id,payment_id});
    try {
        await newOrder.save();
        return res.status(200).send({
            message:"Success"
        })
    } catch (error) {
        console.log(error);
        let err = new Error(error.message);
        err.status = error.status||500;
        return next(err);
    }
}
exports.getAllOrders = async(req,res,next)=>{
    try {
        const allOrders = await Orders.find({}).sort("updatedAt");
        return res.status(200).send({message:"Success",allOrders})
    } catch (e) {
        let err = new Error(e.message)
        return next(err);
    }
}
exports.getOrderById = async(req,res,next)=>{
    try {
        const order = await Orders.findById(req.params.id);
        return res.status(200).send({message:"Success",order})

    } catch (e) {
        console.log(e)
        if(e.kind=="ObjectId"){
            let err = new Error("Invalid Id")
            err.status = 404
            return next(err);   
        }
        let err = new Error(e.message)
        return next(err);
    }
}