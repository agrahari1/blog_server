const mongoose = require("mongoose");
const postSchema = mongoose.Schema({
  post_title: {
    type: String,
    require: true,
  },
  post_description: {
    type: String,
    require: true,
  },
  post_category: {
    type: Array,
    require: false,
  },
});

const post = new mongoose.model("post", postSchema);
module.exports = post;
