const blogController = require("../controller/userController");
const articalController = require("../controller/blogPostControler");

async function handleRoute(req, res) {
  const { method, url } = req;
  console.log("url", url);
  switch (url) {
    //SIGNUP
    case "/signup":
      if (method === "POST") {
        return await blogController.signup(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not allowed");
      }

      break;
    //LOGIN
    case "/login":
      if (method === "POST") {
        return await blogController.login(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not allowed");
      }
      break;
    //VERIFY
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
    //FORGER PASSWORD
    case "/forgotPassword":
      if (method === "POST") {
        return await blogController.forgotPassword(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;
    //RESET PASSWORD
    case "/resetPassword":
      if (method === "POST") {
        return await blogController.resetPassword(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;

    //Blog POST
    case "/publishBlog":
      if (method === "POST") {
        return await articalController.publishBlog(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;

    //Get Blog Post
    case "/getBlogPost":
      if (method === "GET") {
        return await articalController.getBlogPost(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
    //CREATE BLOG
    case "/createBlog":
      if (method === "POST") {
        return await articalController.createBlog(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;
    //DELETE ARTICAL
    case "/deleteBlog":
      if (method === "POST") {
        return await articalController.deleteBlog(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;
    //GET DRAFT BLOG
    case "/draftGetBlog":
      if (method === "POST") {
        return await articalController.draftGetBlog(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;

    //GET ALL BLOG
    case "/allBlogGet":
      if (method === "GET") {
        return await articalController.allBlogGet(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;
    //GET BLOG ONE
    case "/getBlogOne":
      if (method === "POST") {
        return await articalController.getBlogOne(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;

    //UPDATE Blog
    case "/updateBlog":
      if (method === "POST") {
        return await articalController.updateBlog(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;

    // permission routes
    case "/adminAddPermission":
      if (method === "POST") {
        return await perController.addPermission(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;
    //PROFILE
    case "/profile":
      if (method === "GET") {
        return await perController.getProfile(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;
    //GET PERMISSION
    case "/get-permissions":
      if (method === "GET") {
        return await perController.getPermissions(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;
    //DELETE -PERMISSION
    case "/delete-permission":
      if (method === "POST") {
        return await perController.deletePermission(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;
    //UPDATE PERMISSION
    case "/update-permission":
      if (method === "POST") {
        return await perController.updatePermission(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;

    //ADD CATOGRY
    case "/add-catogry":
      if (method === "POST") {
        return await catController.addCategory(req, res);
      } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("405 Method not Found");
      }
      break;

    default:
    // throw new Error('404 Not Found');
  }
}

module.exports = { handleRoute };
