var http = require("http");
const connectDB = require("./Utils/blogConnect");
const { handleRoute } = require("./routes/blogRouter");
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
//const { options } = require("joi");
const jsonParser = bodyParser.json();
const server = http.createServer().listen(port);
console.log(`listening on port ${port}`);
connectDB();

server.on("request", function (req, res) {
  console.log(`METHOD:${req.method};URL:${res.url}`);
  //console.log('hhhh')
  switch (req.method) {
    case "GET":
    case "PUT":
    case "POST":
    case "DELETE":
    case "PATCH":
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // REQUIRED CORS HEADER
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept", // REQUIRED CORS HEADER
      });
      jsonParser(req, res, function () {
        handleRoute(req, res);
      });
      //handleRoute(request,response)

      res.end();
      break;
    case "OPTIONS":
      res.writeHead(200, {
        "Content-Type": "application/json",
        "access-control-allow-origin": "*",
        "access-control-allow-headers":
          "Origin, X-Requested-With, Content-Type, Accept", // REQUIRED CORS HEADER
      });
      res.end();
      break;

    default:
      res.writeHead(404, {
        "Content-Type": "application/json",
        "access-control-allow-origin": "*",
        "access-control-allow-headers":
          "Origin, X-Requested-With, Content-Type, Accept", // REQUIRED CORS HEADER
      });
      res.end(JSON.stringify({ error: `method ${req.method} not allowed` }));
      break;
  }
});

// const server = http
//   .createServer(function (req, res) {
//     // res.end("hello world");
//     // jsonParser(req, res, function () {
//     //   handleRoute(req, res);
//     // });
//   })
//   .listen(5000, () => {
//     console.log("server is connected at port http://localhost:5000");
//     // connectDB();

//   });
// server.on("req", function (req, res) {
//   console.log('hii');
//   console.log(`METHOD:${req.method} ; URL:${req.url}`);

//   switch (req.method) {
//     case "GET":
//     case "PUT":
//     case "POST":
//     case "PATCH":
//     case "DELETE":
//       res.writheHead(200, {
//         "Content-Type": "application/json",
//         "Access-Control-Allow-Origin": "*", // REQUIRED CORS HEADER
//         "Access-Control-Allow-Headers":
//           "Origin, X-Requested-With, Content-Type, Accept", // REQUIRED CORS HEADER
//       });
//       jsonParser(req, res, function () {
//         handleRoute(req, res);
//       });
//       break;
//     case "OPTIONS":
//       res.writeHead(200, {
//         "Access-Control-Allow-Origin": "*", // REQUIRED CORS HEADER
//         "Access-Control-Allow-Methods": "GET, POST, DELETE, PUT, PATCH", // REQUIRED CORS HEADER
//         "Access-Control-Allow-Headers":
//           "Origin, X-Requested-With, Content-Type, Accept", // REQUIRED CORS HEADER
//       });
//       res.end();
//       break;
//     default:
//       res.writeHead(405, {
//         "Content-Type": "application/json",
//       });
//       res.end(JSON.stringify({ error: `method ${req.method} not allowed` }));
//       break;
//   }
// });
