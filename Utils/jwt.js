const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token =
    req.body.token || req.query.token || req.headers.autorization.split(" ")[1];
  if (!token) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error");
  }

  try {
    const decoded = jwt.verify(token, "your-secret-key");
    if (!decoded) {
      res.status(401);
      res.end("authentication failed");
    }

    console.log(decoded);
    next();
  } catch (error) {}
}

// function to generate jwt token

const generateToken = (userData) => {
  return jwt.sign(userData, JWT_SECRET);
};
module.exports = { verifyToken, generateToken };
