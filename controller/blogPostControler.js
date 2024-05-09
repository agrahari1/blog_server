const header = require("../Utils/header");
const blogModel = require("../model/blogModle");
const userModel = require("../model/userSchema");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

//CREATE Blog
async function createBlog(req, res) {
  try {
    const { title, description, category, token } = req.body;
    const blog_schema = Joi.object({
      title: Joi.string().required("Plese enter title of article"),
      description: Joi.string().required("Plese enter the description"),
      category: Joi.string().required("Please select category"),
      token: Joi.string(),
    });
    const { error } = blog_schema.validate(req.body);
    if (error) {
      res.writeHead(400, header),
        res.end(
          JSON.stringify({
            success: false,
            message: error.details[0].message,
          })
        );
      return;
    } else {
      const decoded = jwt.verify(token, "your-secret-key");
      console.log(decoded);
      //const auther_id = user._id;
      //const auther_id = email._id;
      //console.log(auther_id);
      //const data = await new articalModel({ ...req.body, auther_id });
      //const data = await new articalModel({ ...req.body,email });
      const data = await new blogModel({ ...req.body });
      data.save();
      res.writeHead(201, header);
      res.end(
        JSON.stringify({
          success: true,
          message: "Blog is created !!",
        })
      );
      return;
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

//DELETE BLOG

async function deleteBlog(req, res) {
  try {
    // const decoded = jwt.verify(req.body.token, "your-secret-key");
    // if (!decoded) {
    //   res.writeHead(400, header);
    //   return res.end("unauthorized user");
    // }

    // const user = await userModel.findById({ _id: decoded.userId });
    // if (!user) {
    //   res.writeHead(400, header);
    //   return res.end("User not exist ");
    // }
    const { id } = req.body;
    // const emailSchema = Joi.object({
    //   id: Joi.string().required(),
    // });

    await blogModel.findByIdAndDelete(id);
    // await blogModel.findByOneAndDelete();
    res.writeHead(200, header);
    res.end(
      JSON.stringify({
        success: true,
        message: "deleted successfull",
      })
    );
  } catch (error) {
    console.log(error);
    res.writeHead(500, header);
    res.end(
      JSON.stringify({
        success: false,
        message: error.message,
      })
    );
  }
}

// DRAFT GET Blog
async function draftGetBlog(req, res) {
  try {
    // console.log(req.body.token);
    // const decoded = jwt.verify(req.body.token, "your-secret-key");
    // if (!decoded) {
    //   res.writeHead(400, header);
    //   return res.end("unauthorized user");
    // }

    // const user = await userModel.findById({ _id: decoded.userId });
    // if (!user) {
    //   res.writeHead(400, header);
    //   return res.end("User not exist ");
    // }
    // const { userId } = req.body;
    // const users = await userModel.find({ userId });
    // console.log(users, "user");
    // if (!users) {
    //   res.writeHead(400, header);

    //   return res.end(
    //     JSON.stringify({ success: false, message: "User is not Registered" })
    //   );
    // }
    const data = await blogModel.find({ isPublish: false });
    if (data) {
      res.writeHead(200, header);
      return res.end(
        JSON.stringify({
          success: true,
          data: data,
        })
      );
    } else {
      res.writeHead(400, header);
      return res.end(
        JSON.stringify({
          success: false,
          message: "Blog not exist !!",
        })
      );
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
//ALL BLOG GET

async function allBlogGet(req, res) {
  try {
    const data = await blogModel.find({ isPublish: true });
    if (data) {
      res.writeHead(200, header);
      return res.end(
        JSON.stringify({
          success: true,
          data: data,
        })
      );
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
//Get blog one

async function getBlogOne(req, res) {
  try {
    const { id } = req.body;

    const data = await blogModel.findById(id);
    console.log(data);
    if (data) {
      res.writeHead(200, header);
      return res.end(
        JSON.stringify({
          success: true,
          // message: "data fetch successfully!!",
          data: data,
        })
      );
    } else {
      res.writeHead(400, header);
      return res.end(
        JSON.stringify({
          success: false,
          message: "Blog not exist !!",
        })
      );
    }
  } catch (error) {
    console.log(error);
  }
}

//UPDATE BLOG

async function updateBlog(req, res) {
  try {
    // const decoded = jwt.verify(req.body.token, "your-secret-key");
    // if (!decoded) {
    //   res.writeHead(400, header);
    //   return res.end("unauthorized user");
    // }

    // const user = await userModel.findById({ _id: decoded.userId });
    // if (!user) {
    //   res.writeHead(400, header);
    //   return res.end("User not exist ");
    // }
    const { id, title, description, category } = req.body;
    // const user = await userModel.find({ userId });
    // console.log(user);
    // if (!user) {
    //   res.writeHead(400, header);

    //   return res.end(
    //     JSON.stringify({ success: false, message: "User is not Registered" })
    //   );
    // }
    const data = await blogModel.updateOne(
      { _id: id },
      {
        $set: {
          title: title,
          description: description,
          category: category,
          // email: email,
        },
      }
    );
    res.writeHead(200, header);
    return res.end(
      JSON.stringify({
        success: true,
        message: "update seccessfully",
      })
    );
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
//Publish Blog
async function publishBlog(req, res) {
  try {
    //const decoded = jwt.verify(req.body.token, "your-secret-key");
    // if (!decoded) {
    //   res.writeHead(400, header);
    //   return res.end("unauthorized user");
    // }

    // const user = await userModel.findById({ _id: decoded.userId });
    // if (!user) {
    //   res.writeHead(400, header);
    //   return res.end("User not exist ");
    // }
    const { id } = req.body;
    // const user = await userModel.find({ userId });
    // console.log(user);
    // if (!user) {
    //   res.writeHead(400, header);

    //   return res.end(
    //     JSON.stringify({ success: false, message: "User is not Registered" })
    //   );
    // }
    await blogModel.findByIdAndUpdate(id, { $set: { isPublish: true } });
    res.writeHead(200, header);
    return res.end(
      JSON.stringify({
        success: true,
        message: "Publish Blog successfully !!",
      })
    );
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
//Get Publish blog
async function getBlogPost(req, res) {
  try {
    // const decoded = jwt.verify(req.body.token, "your-secret-key");
    // if (!decoded) {
    //   res.writeHead(400, header);
    //   return res.end("unauthorized user");
    // }

    // const user = await userModel.findById({ _id: decoded.userId });
    // if (!user) {
    //   res.writeHead(400, header);
    //   return res.end("User not exist ");
    // }
    // const { userId } = req.body;
    // const user = await userModel.find({ userId });
    // console.log(user);
    // if (!user) {
    //   res.writeHead(400, header);
    //   return res.end(
    //     JSON.stringify({ success: false, message: "User is not Registered" })
    //   );
    // }
    const data = await blogModel
      .find({ isPublish: true })
      .sort({ updatedAt: -1 });
    if (data) {
      res.writeHead(200, header);
      return res.end(
        JSON.stringify({
          success: true,
          // message: "data fetch successfully!!",
          data: data,
        })
      );
    } else {
      res.writeHead(400, header);
      return res.end(
        JSON.stringify({
          success: false,
          message: "Blog not exist !!",
        })
      );
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
module.exports = {
  createBlog,
  deleteBlog,
  draftGetBlog,
  updateBlog,
  getBlogOne,
  publishBlog,
  getBlogPost,
  allBlogGet,
};
