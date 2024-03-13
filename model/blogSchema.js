const mongoose = require("mongoose");
// const { admin } = require("../controller/categoryController");
// const role = ["admin", "user"];
const blogSchema = mongoose.Schema(
  {
    fname: {
      type: String,
      required: [true, "Name must require"],
      // trim: true,
    },
    lname: {
      type: String,
      // required: [true, "last name must require"],
      // trim: true,
    },
    email: {
      type: String,
      required: [true, "mail is must "],
      // trim: true,
    },
    password: {
      type: String,
    },
    phoneNo: {
      type: String,
    },
    role: {
      type: Number,
      default:0,  // 0 -> Normal user , 1 -> Admin ,  2 -> sub - Admin 
      // require:true
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
