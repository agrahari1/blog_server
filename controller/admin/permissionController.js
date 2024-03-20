const permissionControl = require("../../model/permissinCategorySchema");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const userModel = require("../../model/blogSchema");


//Create Permission
async function addPermission(req, res) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.writeHead(400);
      res.end("please enter token");
    }

    const decoded = jwt.verify(token, "your-secret-key");
    if (!decoded) {
      res.statusCode = 400
      res.end("please enter valid token");
    }
    //req.user = decoded.userId;
    const user = await userModel.findById({ _id: decoded.userId });
    if (!user) {
      res.statusCode = 400
      res.end("user not found");
    }

    if (user.role != "admin") {
      res.statusCode = 400
      res.end(
        JSON.stringify({
          success: false,
          message: "You have not permission to access this role",
        })
      );
    } else {
      const { permission_name } = req.body;
      // console.log("hii")
      const permissionSchema = Joi.object({
        permission_name: Joi.string().alphanum().max(30).required(),
      });

      const { error } = permissionSchema.validate(req.body);
      if (error) {
        res.statusCode = 400
        res.end(error.details[0].message);
        //   console.log(error);
        return;
      }

      const isExist = await permissionControl.findOne({ permission_name });
      if (isExist) {
        res.statusCode = 400
        res.end("Permission name is already exists !");
      } else {
        var obj = {
          permission_name,
        };
        // default is not working in body
        if (req.body.default != null) {
          obj.is_default = req.body.default;
        }

        const newPermission = await new permissionControl(obj).save();
        res.statusCode = 200
        res.end(
          JSON.stringify({
            success: true,
            message: "Permission add Successfully!",
            data: newPermission,
          })
        );
      }
    }
  } catch (error) {
    console.error(error);
    res.statusCode = 500
    res.end("Internal Server Error");
  }
}

// Get Profile


async function getProfile(req, res) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.statusCode = 400
      res.end(`please enter token`);
    }
    const decoded = jwt.verify(token, "your-secret-key");
    if (!decoded) {
      res.statusCode = 400
      res.end(`please enter valid token`);
    }
    console.log(decoded);
    console.log("hii");

    const user = await userModel.findById({ _id: decoded.userId });

    if (!user) {
     
      res.statusCode = 400
      res.end(`user is not found`);
    }
    res.statusCode = 200
    res.end(
      JSON.stringify({
        success: true,
        message: "Get profile Successfully!",
      })
    );
  } catch (error) {
    console.error(error);
    res.statusCode = 500
    res.end("Internal Server Error");
  }
}

// read permission get
async function getPermissions(req, res) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.writeHead(400,{
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // REQUIRED CORS HEADER
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept", // REQUIRED CORS HEADER
      });
      res.end("please enter token");
    }

    const decoded = jwt.verify(token, "your-secret-key");
    if (!decoded) {
      res.writeHead(400,{
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // REQUIRED CORS HEADER
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept", // REQUIRED CORS HEADER
      });
      res.end("please enter valid token");
    }
    //req.user = decoded.userId;
    const user = await userModel.findById({ _id: decoded.userId });
    if (!user) {
      res.writeHead(400,{
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // REQUIRED CORS HEADER
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept", // REQUIRED CORS HEADER
      });
      res.end("user not found");
    }

    if (user.role != 1) {
      // not equal to admin
      res.writeHead(400,{
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // REQUIRED CORS HEADER
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept", // REQUIRED CORS HEADER
      });
      res.end(
        JSON.stringify({
          success: false,
          message: "You have not permission to access this role",
        })
      );
    } else {
      const permission = await permissionControl.find({});
      res.end(
        JSON.stringify({
          success: true,
          message: "Permission fetched Successfully!",
          data: permission,
        })
      );
    }
  } catch (error) {
    console.error(error);
    res.writeHead(500,{
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", // REQUIRED CORS HEADER
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept", // REQUIRED CORS HEADER
    });
    res.end("Internal Server Error");
  }
}

//delete permission
async function deletePermission(req, res) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.writeHead(400,{
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // REQUIRED CORS HEADER
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept", // REQUIRED CORS HEADER
      });
      res.end("please enter the token");
    }

    const decoded = jwt.verify(token, "your-secret-key");
    if (!decoded) {
      res.writeHead(400,{
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // REQUIRED CORS HEADER
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept", // REQUIRED CORS HEADER
      });
      res.end("please enter the valid token");
    }
    const user = await userModel.findById({ _id: decoded.userId });

    if (!user) {
      res.writeHead(400,{
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // REQUIRED CORS HEADER
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept", // REQUIRED CORS HEADER
      });
      res.end("user is not found");
    }

    if (user.role != 1) {
      // not equal to admin

      res.writeHead(400,{
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // REQUIRED CORS HEADER
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept", // REQUIRED CORS HEADER
      });
      res.end(
        JSON.stringify({
          success: false,
          message: "You have not permission to access this role",
        })
      );
    } else {
      const { id } = req.body;
      const idSchema = Joi.object({
        id: Joi.string().required(),
      });
      const { error } = idSchema.validate(req.body);
      if (error) {
        res.writeHead(400, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // REQUIRED CORS HEADER
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept", // REQUIRED CORS HEADER
        });
        res.end(error.details[0].message);
        return;
      }

      await permissionControl.findByIdAndDelete({ _id: id });
      res.end(
        JSON.stringify({
          success: true,
          message: "Permission Delete Successfully!",
        })
      );
    }
  } catch (error) {
    console.error(error);
    res.writeHead(500,{
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", // REQUIRED CORS HEADER
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept", // REQUIRED CORS HEADER
    });
    res.end("Internal Server Error");
  }
}
// updatePermission
async function updatePermission(req, res) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.writeHead(400,{
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // REQUIRED CORS HEADER
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept", // REQUIRED CORS HEADER
      });
      res.end(`please enter token`);
    }
    const decoded = jwt.verify(token, "your-secret-key");
    if (!decoded) {
      res.writeHead(400,{
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // REQUIRED CORS HEADER
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept", // REQUIRED CORS HEADER
      });
      res.end(`please enter valid token`);
    }
    const user = await userModel.findById({ _id: decoded.userId });
    if (!user) {
      res.writeHead(400,{
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // REQUIRED CORS HEADER
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept", // REQUIRED CORS HEADER
      });
      res.end(`user is not found`);
    }

    if (user.role != 1) {
      // not equal to admin

      res.writeHead(400, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // REQUIRED CORS HEADER
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept", // REQUIRED CORS HEADER
      });
      res.end(
        JSON.stringify({
          success: false,
          message: "You have not permission to access this role",
        })
      );
    } else {
      const { id, permission_name } = req.body;
      const updatePermissionSchema = Joi.object({
        id: Joi.string().required(),
        permission_name: Joi.string().alphanum().max(30).required(),
      });
      const { error } = updatePermissionSchema.validate(req.body);
      if (error) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end(error.details[0].message);
        return;
      }
      const isExist = await permissionControl.findOne({ _id: id });
      if (!isExist) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Permission ID is not found !");
      }

      const isNameAssigned = await permissionControl.findOne({
        _id: { $ne: id },
        permission_name,
      });
      if (isNameAssigned) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Permission name to assigned to another permission !");
      }
      var updatePermission = {
        permission_name,
      };
      // default is not working in body
      if (req.body.default != null) {
        updatePermission.is_default = parseInt(req.body.default);
      }
      const updateedPermission = await permissionControl.findByIdAndUpdate(
        { _id: id },
        { $set: updatePermission },
        { new: true }
      );

      res.end(
        JSON.stringify({
          success: true,
          message: "Permission update Successfully!",
          data: updateedPermission,
        })
      );
    }
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end("Internal Server Error");
  }
}
module.exports = {
  addPermission,
  getProfile,
  getPermissions,
  deletePermission,
  updatePermission,
};
