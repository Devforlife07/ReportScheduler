const Router = require("express").Router();
const {addOrder,getAllOrders,getOrderById} = require("./methods/orderMethod")
Router.route("/").post(addOrder).get(getAllOrders);
Router.route("/:id").get(getOrderById)


module.exports = Router;