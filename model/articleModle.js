const mongoose = require("mongoose");
const blogArticalSchema = mongoose.Schema(
  {
  //   auther_id: {
  //     type: String,
     
  // },
  email:{
    type:String,
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
      default:Date.now()
    },
    isDeleted:{
      type:Boolean,
      default:false
    },
    isPublish:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);



const articalPost = new mongoose.model("articlPost", blogArticalSchema);
module.exports = articalPost;
