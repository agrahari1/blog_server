const blogController = require("../controller/blogController");
const perController = require("../controller/admin/permissionController");
const catController = require("../controller/categoryControler");

async function handleRoute(req, res) {
  const { method, url } = req;
  console.log("url", url);
  switch (url) {
    case "/signup":
      if (method === "POST") {
        return await blogController.signup(req, res);
       
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not allowed");
      }
      
      break;

    case "/login":
      if (method === "POST") {
        return await blogController.login(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not allowed");
      }
      break;

    case "/verify_otp":
      if (method === "POST") {
        return await blogController.verify_otp(req, res);
      } else {
        res.writeHead(405, { "Content-type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;
    case "/resend_otp":
      if (method === "POST") {
        return await blogController.resend_otp(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;

    case "/forgotPassword":
      if (method === "POST") {
        return await blogController.forgotPassword(req,res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;

    case "/forgetPasswordVeryfyOtp":
      if (method === "POST") {
        // console.log("hiii")
        return await blogController.forgetPasswordVeryfyOtp(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;

    case "/changePassword":
      if (method === "POST") {
        return await blogController.changePassword(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;
    case "/setPassword":
      if (method === "POST") {
        return await blogController.setPassword(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;
    case "/forgetPasswordChangePassword":
      if (method === "POST") {
        return await blogController.forgetPasswordChangePassword(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;

    //permission routes
    case "/adminAddPermission":
      if (method === "POST") {
        return await perController.addPermission(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;
    case "/profile":
      if (method === "GET") {
        return await perController.getProfile(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;
    case "/get-permissions":
      if (method === "GET") {
        return await perController.getPermissions(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;
    case "/delete-permission":
      if (method === "POST") {
        return await perController.deletePermission(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;

    case "/update-permission":
      if (method === "POST") {
        return await perController.updatePermission(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;

    case "/add-catogry":
      if (method === "POST") {
        return await catController.addCategory(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;
    case "add-post":
      if (method === "POST") {
      }

    default:
    // throw new Error('404 Not Found');
  }
}

module.exports = { handleRoute };
