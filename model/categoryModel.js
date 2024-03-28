const mongoose = require("mongoose");
const categorySchema = mongoose.Schema(
  {
    // category_name: {
    //   type: String,
    //   require: true,
    //   unique:true
    // },
    Category: {
      type: String,
      require: true,
      unique:true
    },
    data:{
      type:Date,
      default:Date.now
    },
    isDeleted:{
      type:Boolean,
      default:false
    },
    
  },{
    timestamps: true,
  });

const Category = new mongoose.model("Category", categorySchema);
module.exports = {Category};