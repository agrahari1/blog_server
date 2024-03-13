const mongoose = require("mongoose");
const blogArticalSchema = mongoose.Schema(
  {
    artical_name: {
      type: String,
      require: true,
    },
    artical_title: {
      type: String,
      require: true,
    },
    date: {
      type: String,
      default:Date.now()
    },
  },
  {
    timestamps: true,
  }
);

const Artical = new mongoose.model("articl", blogArticalSchema);
module.exports = Artical;
