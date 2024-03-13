const mongoose = require("mongoose");
const blogAdminSchema = mongoose.Schema(
  {
    admin_id:{
        type:String,
        required:true
    },

    admin_name: {
      type: String,
      required:true
      
    },
    admin_email:{
        type:String,
        required:true
    }
  },
  {
    timestamps: true,
  }
)
const admin = new mongoose.model("admin",blogAdminSchema);
module.exports = admin;
