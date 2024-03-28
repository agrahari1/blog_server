const header = require("../Utils/header");
const articalModel = require("../model/articelModle");
const userModel = require("../model/blogSchema");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

//CREATE ARTICAL
async function createArtical(req, res) {
  try {
    // const token = req.headers.authorization;
    // if (!token) {
    //   res.writeHead(400, header);
    //   return res.end("unauthorized user");
    // }

    // const decoded = jwt.verify(token, "your-secret-key");

    // if (!decoded) {
    //   res.writeHead(400, header);
    //   return res.end("unauthorized user");
    // }
    // console.log(decoded);
    // req.user = decoded.userId;
    // const user = await userModel.findById({ _id: decoded.userId });
    //const user = await userModel.find({ _id:email });
    // if (!user) {
    //   res.writeHead(400, header);
    //   return res.end("User not exist ");
    // }

    const article_schema = Joi.object({
      //email: Joi.string().email().required("Email is required"),
      title: Joi.string().required("Plese enter title of article"),
      description: Joi.string().required("Plese enter the description"),
      category: Joi.string().required("Please select category"),
    });

    const { error } = article_schema.validate(req.body);
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
      //const auther_id = user._id;
      //const auther_id = email._id;
      //console.log(auther_id);
      //const data = await new articalModel({ ...req.body, auther_id });
      //const data = await new articalModel({ ...req.body,email });
      const data = await new articalModel({ ...req.body });
      data.save();
      res.writeHead(201, header);
      res.end(
        JSON.stringify({
          success: true,
          message: "Artical is created !!",
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

//DELETE ARTICAL
// Not working
async function deleteArtical(req, res) {
  try {
    // const token = req.headers.authorization;
    // if (!token) {
    //   res.writeHead(400, header);
    //   res.end("unauthorized user");
    // }

    // const decoded = jwt.verify(token, "your-secret-key");

    // if (!decoded) {
    //   res.writeHead(400, header);
    //   res.end("unauthorized user");
    // }

    //console.log(decoded);
    const { id } = req.body;

    const data = await articalModel.findById(id);

    if (data) {
      await articalModel.findByIdAndDelete(id);
      res.writeHead(200, header);
      res.end(
        JSON.stringify({
          success: true,
          message: "deleted successfull",
        })
      );
    } else {
      res.writeHead(400, header);
      res.end(
        JSON.stringify({
          success: false,
          message: "you have not authority to delete artical",
        })
      );
    }
    // console.log("hiii");
    // if (data.auther_id == decoded.userId) {
    //   if (
    //     await articalModel.findOneAndDelete(
    //       { _id: articalId },
    //       { isDeleted: true }
    //     )
    //   ) {
    //     res.writeHead(200, header);
    //     res.end(
    //       JSON({
    //         success: true,
    //         message: "soft deleted successfull",
    //       })
    //     );
    //   } else {
    //     res.writeHead(400, header);
    //     res.end(
    //       JSON({
    //         success: false,
    //         message: "artical is not found",
    //       })
    //     );
    //   }
    // } else {
    //   res.writeHead(400, header);
    //   res.end(
    //     JSON.stringify({
    //       success: false,
    //       message: "you have not authority to delete artical",
    //     })
    //   );
    // }
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

// GET ARTICAL
async function getArtical(req, res) {
  try {
    // const token = req.headers.authorization;
    // if (!token) {
    //   res.writeHead(400, header);
    //   res.end("unauthorized user");
    // }

    // const decoded = jwt.verify(token, "your-secret-key");

    // if (!decoded) {
    //   res.writeHead(400, header);
    //   res.end("unauthorized user");
    // }

    // console.log(decoded);
    //const data = await articalModel.find({ auther_id: decoded.userId });
    // const {email} = req.body

    const data = await articalModel.find({isPublish:false}).sort({
      updatedAt:-1});
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
          message: "Artical not exist !!",
        })
      );
    }
  } catch (error) {
    // console.log("hiii");
    res.writeHead(500, header);
    return res.end(
      JSON.stringify({
        success: false,
        message: error.message,
      })
    );
  }
}

//Get artical one

async function getArticalOne(req, res) {
  try {
    const { id } = req.body;
    const data = await articalModel.findById(id);
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
          message: "Artical not exist !!",
        })
      );
    }
  } catch (error) {
    console.log(error);
  }
}

//UPDATE ARTICAL

async function updateArtical(req, res) {
  try {
    // const token = req.headers.authorization;
    // if (!token) {
    //   res.writeHead(400, header);
    //   res.end("unauthorized user");
    // }

    // const decoded = jwt.verify(token, "your-secret-key");

    // if (!decoded) {
    //   res.writeHead(400, header);
    //   res.end("unauthorized user");
    // }

    // console.log(decoded);
    //const { id } = req.body;

    // const data = await articalModel.updateOne(
    //   { _id: id },
    // { $set: { title: title, description: description, category: category } }
    // );
    //const { id } = req.body;
    const { id, title, description, category } = req.body;
    const data = await articalModel.updateOne(
      { _id: id },
      { $set: { title: title, description: description, category: category } }
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
async function publishBlog(req,res){ 
  try {
   const {id} = req.body
    await articalModel.findByIdAndUpdate(id,{$set:{isPublish:true}})
    res.writeHead(200,header);
    return res.end(JSON.stringify({
      success:true,
      message:"Publish Blog successfully !!"
    }))
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
async function getBlogPost(req,res){
  try {
    const data = await articalModel.find({isPublish:true}).sort({updatedAt:-1});
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
  createArtical,
  deleteArtical,
  getArtical,
  updateArtical,
  getArticalOne,
  publishBlog,
  getBlogPost
};
