const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const itemSchema = new Schema({
    title:String
});
module.exports = mongoose.model("Item",itemSchema);
