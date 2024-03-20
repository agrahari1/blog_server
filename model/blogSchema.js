const mongoose = require("mongoose");
// const { admin } = require("../controller/categoryController");
//const role = ["admin", "user"];
const blogSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name must require"],
       trim: true,
    },
    lname: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Mail must required "],
       trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    phoneNo: {
      type: String,
    },
    role: {
      type:String,
      default:'user',  // 0 -> Normal user , 1 -> Admin ,  2 -> sub - Admin 
      
    },

    isVerify: {
      type: Boolean,
      required: false,
    },
    gender: {
      type: String,
      enum: ["M", "F", "Other"],
    },
    FullAddress: {
      type: String,
    },
    Otp: {
      Type: String,
    },
  },
  {
    timestamps: true,
  }
);
const userModel = mongoose.model("users", blogSchema);
module.exports = userModel;
//   module.exports = mongoose.model("user", userSchema);
