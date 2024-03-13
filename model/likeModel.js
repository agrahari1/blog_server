const mongoose = require("mongoose");
const likeSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "userModel",
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "post",
  }

});
const like = new mongoose.model("comment", likeSchema);
module.exports = like;