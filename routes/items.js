const Router = require("express").Router();
const {addItem,getAllItems,getItemById} = require("./methods/itemsMethodsjs");

Router.route("/").post(addItem).get(getAllItems)
Router.route("/:id").get(getItemById)


module.exports = Router;