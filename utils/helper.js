const Item = require("../models/items");
exports.checkItem = async(id)=>{
  const result = await Item.findOne({ _id: id }).select("_id").lean()
        if (result) {
            return true;
        }
        return false;
}