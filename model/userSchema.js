const mongoose = require("mongoose");
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
      required: [true],
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
      type: String,
      default: "user",
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
