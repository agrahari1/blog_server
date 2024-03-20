const userModel = require("../model/blogSchema");
const OtpModel = require("../model/blogOTP");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOTP } = require("../Utils/sendOtp");
const header = require("../Utils/header");


//SIGNUP

async function signup(req, res) {
  try {
    
    const { name, email, password } = req.body;

    const schema = Joi.object({
      name: Joi.string().alphanum().max(30).required("Name is required"),
      email: Joi.string().email().required("Email is required"),
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

    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      res.writeHead(400, header);
      return res.end(
        JSON.stringify({
          success: false,
          message: "User is not found",
        })
      );
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    await sendOTP(email, otp);
    const findOTP = await OtpModel.findOne({email,
     // isExpired: { $gte: Date.now() }
    })
    // const findOtp = await OtpModel.findOne({
    //   existingUser,
    //     isExpired: { $gte: Date.now() },
    // });

    if (findOTP) {
      res.writeHead(400, header);
      return res.end({
        success: false,
        message: "Otp already sent  please try after two minutes",
      });
    }
   
    console.log(otp);
     await new OtpModel({ email, otp }).save();
    // await sendOTP(email, otp);
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
      email: Joi.string().email().required("Email must required"),
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
    const findEmail = await userModel.findOne({ email });
    if (!findEmail) {
      res.writeHead(400, header);
      return res.end(
        JSON.stringify({
          success: false,
          message: "Email is not register",
        })
      );
    } else {
      const otp = Math.floor(100000 + Math.random() * 900000);
      await new OtpModel({ email, otp }).save();
      await sendOTP(email, otp);
      await OtpModel.findOneAndUpdate({ email, otp: otp });
      //await OtpModel.findByIdAndUpdate(findEmail._id, { otp: otp });
      res.writeHead(200, header);
      return res.end(
        JSON.stringify({
          success: true,
          message: " OTP sent to mail",
        })
      );
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

//REset password

async function resetPassword(req,res) {
  try {    
    const { email,password } = req.body;
    
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
    if(!checkUser){
      res.writeHead(400, header);
      res.end(JSON.stringify({
        success:false,
        message:"user is not registerd"
      }))
    }else {
    
      // const newPassword = req.body.password
     // await userModel.findOneAndUpdate(checkUser._id,{password:newPassword})
     // const newCheckUser = await userModel.findOne({email})
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await userModel.findOneAndUpdate({id:checkUser._id},{$set:{password:hashedPassword}})
      //await data.save()
      // await new userModel({
      //   email,
      //   password: hashedPassword,
      // }).save();
      res.writeHead(200,header)
      res.end(JSON.stringify({
        success:true,
        message:"password reset"
      }))
    }
  } catch (error) {
    res.writeHead(500, header)
    return res.end(
      JSON.stringify({
        success: false,
        message: error.message,
      })
    );
  }
}
module.exports = {
  signup,
  login,
  verify_otp,
  resend_otp,
  forgotPassword,
  resetPassword
};
