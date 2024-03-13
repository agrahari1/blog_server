const mongoose = require("mongoose");
const commentSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "userModel",
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "post",
  },
  comment: {
    type: String,
    require: true,
  },
});

const comment = new mongoose.model("comment", commentSchema);
module.exports = comment;
