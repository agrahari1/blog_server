const userModel = require("../model/blogSchema");
const OtpModel = require("../model/blogOTP");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOTP } = require("../Utils/sendOtp");
const header = require("../Utils/header");
// const sendOTP = require("../Utils/sendOtp.js");

//SIGNUP

async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    const schema = Joi.object({
      name: Joi.string().alphanum().max(30).required("Name is required"),
      email: Joi.string().required().email().required("Email is required"),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required("Password is required"),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      res.writeHead(400, header);
      return res.end(
        JSON.stringify({ success: false, message: error.details[0].message })
      );
    }

    const checkUser = await userModel.findOne({ email });

    if (checkUser) {
      res.writeHead(400, header);
      return res.end(
        JSON.stringify({
          success: false,
          message: "email already register with us",
        })
      );
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await new userModel({
        name,
        email,
        password: hashedPassword,
      }).save();

      const otp = Math.floor(100000 + Math.random() * 900000);

      await new OtpModel({ email, otp }).save();
      await sendOTP(email, otp);
      res.writeHead(201, header);
      res.end(
        JSON.stringify({
          success: true,
          message: "signup success ful otp sent on email",
        })
      );
      return;
    }
  } catch (err) {
    res.writeHead(500, header);
    return res.end(
      JSON.stringify({
        success: false,
        message: err.message,
      })
    );
  }
}

//LOGIN

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const loginSchema = Joi.object({
      email: Joi.string().required().email(),

      password: Joi.string()
        .required()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    });

    const { error } = loginSchema.validate(req.body);
    if (error) {
      res.writeHead(400, header);
      return res.end({
        success: false,
        message: "Enter valid email-id and password",
      });
    }

    const user = await userModel.findOne({ email });
    // console.log(user.email);
    console.log(user);
    if (!user) {
      res.writeHead(400, header);

      return res.end(
        JSON.stringify({ success: false, message: "Email is not Registered" })
      );
    }

    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      res.writeHead(401, header);
      return res.end(
        JSON.stringify({ success: false, message: "Invalid Credentials" })
      );
    }

    if (!user.isVerify) {
      res.writeHead(400, header);
      return res.end(
        JSON.stringify({
          success: false,
          message: "Please verify your email first",
        })
      );
    }

    //doute
    const token = jwt.sign({ userId: user._id }, "your-secret-key", {
      expiresIn: "1h",
    });
    //doute  upper

    const userData = [{ user }, { token }];

    res.writeHead(200, header);
    return res.end(
      JSON.stringify({
        success: true,
        message: "Login Successfully!",
        data: userData,
      })
    );
  } catch (err) {
    res.writeHead(500, header);
    return res.end(JSON.stringify({ success: false, message: err.message }));
  }
}

//VERIFY OTP

async function verify_otp(req, res) {
  try {
    const { email } = req.body;
    const emailSchema = Joi.object({
      email: Joi.string().required().email(),
      otp: Joi.string()
        .length(6)
        .pattern(/^[0-9]+$/)
        .required(),
    });
    const { error } = emailSchema.validate(req.body);
    //console.log(error?.details[0].message)
    if (error) {
      res.writeHead(400, header);
      // console.log(error?.details[0].message);
      return res.end(
        JSON.stringify({
          success: false,
          message: error.details[0].message,
        })
      );
    }
    //await sendOTP(email, otp);
    const findOtp = await OtpModel.findOne({
      email,
      // isExpired: { $lt: Date.now() },
    });

    if (!findOtp) {
      res.writeHead(400, header);
      return res.end(
        JSON.stringify({
          success: false,
          message: "Otp not found or OTP has expired.",
        })
      );
    }

    if (findOtp.otp != req.body.otp) {
      res.writeHead(400, header);
      return res.end(
        JSON.stringify({ success: false, message: "Invalid otp provided." })
      );
    }

    await OtpModel.deleteOne({ email });

    await userModel.findOneAndUpdate({ email }, { isVerify: true });
    res.writeHead(200, header);
    return res.end(
      JSON.stringify({ success: true, message: "Otp Verified successfully" })
    );
  } catch (err) {
    res.writeHead(500, header);
    return res.end(
      JSON.stringify({
        success: false,
        message: err.message,
      })
    );
  }
}

//RESEND OTP

async function resend_otp(req, res) {
  try {
    const { email } = req.body;

    const resendSchema = Joi.object({
      email: Joi.string().required().email(),
    });

    const { error } = resendSchema.validate(req.bady);
    if (error) {
      res.writeHead(400, header);
      return res.end(
        JSON.stringify({ success: false, message: error.details[0].message })
      );
    }

    const findEmail = await userModel.findOne({ email });

    if (!findEmail) {
      res.writeHead(400, header);
      return res.end(
        JSON.stringify({
          success: false,
          message: "Email is not registered",
        })
      );
    }

    const findOtp = await OtpModel.findOne({
      email,
      isExpired: { $gte: Date.now() },
    });

    if (findOtp) {
      res.writeHead(400, header);
      return res.end({
        success: false,
        message: "Otp already sent  please try after two minutes",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp);
    await new OtpModel({ email, otp }).save();
    await sendOTP(email, otp);
    res.writeHead(200, header);
    return res.end(
      JSON.stringify({
        success: true,
        message: "OTP sent successfully",
      })
    );
  } catch (err) {
    res.writeHead(500, header);
    return res.end(
      JSON.stringify({
        success: false,
        message: err.message,
      })
    );
  }
}

// FORGET PASSWORD

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const forgotPasswordSchema = Joi.object({
      email: Joi.string().email().required('Email must required'),
    });

    const { errr } = forgotPasswordSchema.validate(req.body);
    //console.log(errr?.details[0].message)
    if (errr) {
      res.writeHead(400, header);
      return res.end(
        JSON.stringify({
          success: false,
          message: errr.details[0].message,
        })
      );
    }
    const findEmail = await userModel.findOne({email});
    if (!findEmail) {
      res.writeHead(400, header);
      return res.end(
        JSON.stringify({
          success: false,
          message: "Email is not register",
        })
      );
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    await sendOTP(email, otp);
    const data = await OtpModel.findOneAndUpdate({email,otp:otp});
    //await OtpModel.findByIdAndUpdate(data._id,{otp:otp})
    res.writeHead(200, header);
    return res.end(
      JSON.stringify({
        success: true,
        message: " OTP sent to mail",
      })
    );
  } catch (err) {
    res.writeHead(500, header);
    return res.end(
      JSON.stringify({
        success: false,
        message: err.message,
      })
    );
  }
}

//change password

async function changePassword() {
  try {
    const { email, password } = req.body;
    const schema = Joi.object({
      email: Joi.string().required().email().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      res.writeHead(400, header);
      return res.end(
        JSON.stringify({ success: false, message: error.details[0].message })
      );
    }
    const checkUser = await userModel.findOne({ email });

    if (checkUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await new userModel({
        email,
        password: hashedPassword,
      }).save();
    }
  } catch (error) {
    res.writeHead(500, header);
    return res.end(
      JSON.stringify({
        success: false,
        message: error.message,
      })
    );
  }
}
//FORGET PASSWORD VERYFY OTP

// async function forgetPasswordVeryfyOtp(req, res) {
//   try {
//     const { email, otp, password } = req.body;
//     const forgetPasswordVeryfyOtpSchema = Joi.object({
//       email: Joi.string().required().email(),
//       otp: Joi.string()
//         .length(6)
//         .pattern(/^[0-9]+$/)
//         .required(),
//       password: Joi.string()
//         .required()
//         .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
//     });

//     const { error } = forgetPasswordVeryfyOtpSchema.validate(req.bady);
//     if (error) {
//       res.writeHead=400;
//       res.end("Enter the valid input");
//     }
//     const findData = await userModel.findOne({ email });
//     if (!findData) {
//       res.writeHead=400;
//       res.end("Email is not register");
//     }
//     // console.log("hiii")
//     const findOtp = await OtpModel.findOne({
//       email,
//     });
//     if (!findOtp) {
//       res.statusCode = 400;
//       return res.end(
//         JSON.stringify({
//           success: false,
//           message: "Otp not found or OTP has expired.",
//         })
//       );
//     }
//     if (findOtp.otp != req.body.otp) {
//       res.statusCode = 400;
//       return res.end(
//         JSON.stringify({ success: false, message: "Invalid otp provided." })
//       );
//     }
//     await userModel.findOneAndUpdate(findData._id, { password: password });

//     const salt = await bcrypt.genSalt(10);
//     const pass = req.body.password;
//     const hashedPassword = await bcrypt.hash(pass, salt);
//     await userModel.findOneAndUpdate(findData._id, {
//       password: hashedPassword,
//     });
//     res.statusCode = 200;
//     res.end("Password set successful");
//   } catch (error) {
//     console.log(error);
//   }
// }

// SET PASSWORD

// async function setPassword(req, res) {
//   try {
//     const { email, otp, password } = req.body;

//     const setPasswordSchema = Joi.object({
//       email: Joi.string().required().email(),
//       otp: Joi.string()
//         .length(6)
//         .pattern(/^[0-9]+$/)
//         .required(),
//       password: Joi.string()
//         .required()
//         .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
//     });

//     const { error } = setPasswordSchema.validate(req.bady);
//     if (error) {
//       res.writeHead(404, { "content-Type": "application/json" });
//       res.end("Enter the valid input");
//     }

//     const findData = await userModel.findOne({ email });
//     // console.log(findData)
//     if (!findData) {
//       res.writeHead(404, { "content-Type": "application/json" });
//       res.end("Email is not register");
//     }
//     await sendOTP(email, otp);
//     const findOtp = await OtpModel.findOne({
//       email,
//     });
//     // console.log(findOtp)
//     if (!findOtp) {
//       res.writeHead(400, { "Content-Type": "application/json" });
//       return res.end(
//         JSON.stringify({
//           success: false,
//           message: "Otp not found or OTP has expired.",
//         })
//       );
//     }

//     if (findOtp.otp != req.body.otp) {
//       res.writeHead(400, { "Content-Type": "application/json" });
//       return res.end(
//         JSON.stringify({ success: false, message: "Invalid otp provided." })
//       );
//     }

//     await userModel.findById(findData._id, { password: password });

//     const salt = await bcrypt.genSalt(10);
//     const pass = req.body.password;
//     const hashedPassword = await bcrypt.hash(pass, salt);
//     await userModel.findById(findData._id, {
//       password: hashedPassword,
//     });
//     res.writeHead(200, { "Content-Type": "text/plain" });
//     res.end("Password set successful");
//   } catch (error) {
//     console.error(error);
//     res.writeHead(400, { "content-Type": "application/json" });
//     res.end(error);
//   }
// }

// async function forgetPasswordChangePassword(req, res) {
//   try {
//     const { email, password, conformPassword } = req.body;
//     const changePasswordSchema = Joi.object({
//       email: Joi.string().required().email(),
//       // otp:Joi.string().required(),
//       password: Joi.string()
//         .required()
//         .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
//       conformPassword: Joi.string()
//         .required()
//         .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
//     });

//     const { error } = changePasswordSchema.validate(req.body);
//     if (error) {
//       res.writeHead(404, { "content-Type": "application/json" });
//       res.end("please enter valide input");
//     }
//     const findEmail = await userModel.findOne({ email });
//     if (!findEmail) {
//       res.writeHead(404, { "content-Type": "application/json" });
//       res.end("Email is not register");
//     }

//     const findOtp = await OtpModel.findOne({
//       email,
//       expiredAt: { $gte: Date.now() },
//     });
//     if (!findOtp) {
//       res.writeHead(404, { "content-Type": "application/json" });
//       res.end("Please try after two minutes");
//     }
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     await new OtpModel({ email, otp }).save();
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       auth: {
//         user: "agrahariprashant1@gmail.com",
//         pass: "yuhy rpzb fwcw tttm",
//       },
//     });

//     const mailOptions = {
//       from: "agrahariprashant1@gmail.com",
//       to: "agrahariprashant1@gmail.com",
//       subject: "Your Email Verification OTP",
//       html: `<strong>Your OTP for email verification is ${otp}</strong>`,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent: %s", info.messageId);
//     res.writeHead(200);
//     res.end(" OTP  sent successfully");

//     if (findOtp.otp != email.otp) {
//       res.writeHead(404, { "content-Type": "application/json" });
//       res.end("please enter valid otp");
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }

// async function changePassword(req , res){
//   try{
//  const {password ,} = req.body
//   const changePasswordSchema = Joi.object({
//     email:Joi.string().required().email(),
//     password: Joi.string()
//         .required()
//         .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
//   });
//   const {error} = changePasswordSchema.validate(req.body);

//   if

//   } catch(err){}

//}
module.exports = {
  signup,
  login,
  verify_otp,
  resend_otp,
  forgotPassword,
};
