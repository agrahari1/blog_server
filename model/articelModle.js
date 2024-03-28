const mongoose = require("mongoose");
const blogArticalSchema = mongoose.Schema(
  {
    //   auther_id: {
    //     type: String,

    // },
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
    image: {
      type: String,
    },
    description: {
      type: String,
      require: true,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
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

const articlPosts = new mongoose.model("articlPosts", blogArticalSchema);
module.exports = articlPosts;
