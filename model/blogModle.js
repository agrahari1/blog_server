const mongoose = require("mongoose");
const blogSchema = mongoose.Schema(
  {
    userId: {
      type: String,
    },
    email: {
      type: String,
    },
    title: {
      type: String,
      require: true,
      // trim: true,
    },
    category: {
      type: String,
      require: true,
    },
    token: {
      type: String,
    },
    description: {
      type: String,
      require: true,
      trim: true,
    },
    // date: {
    //   type: Date,
    //   default: Date.now(),
    // },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isPublish: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const blogPosts = new mongoose.model("blogPosts", blogSchema);
module.exports = blogPosts;
