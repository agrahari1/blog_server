const mongoose = require("mongoose");
const blogOTPSchema = mongoose.Schema(
  {
    phoneNo: {
      type: String,
    },
    email: {
      type: String,
    },
    otp: {
      type: Number,
      // default: true,
    },
    isExpired:{
      type:Boolean,
      default:false
    },
    expiredAt: {
      type: Date,
      default: Date.now() + 2 * 60 * 1000,
    },
  },
  {
    timestamps: true,
  }
);

const Otp = new mongoose.model("otp", blogOTPSchema);
module.exports = Otp;


