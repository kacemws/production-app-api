// DOT ENV CONFIGURATION
const dotenv = require("dotenv");
var dotenvExpand = require("dotenv-expand");

var myEnv = dotenv.config();
dotenvExpand(myEnv);

// REQUIRING NECESSARY APPS : EXPRESS - BODYPARSER - CORS
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const InitiateMongoServer = require("./src/utils/db");
var path = require("path");

// ROUTES
const user = require("./src/v1/routes/user");
const supplyRequest = require("./src/v1/routes/supplyRequest");
const cart = require("./src/v1/routes/clientCart");

// INIT
InitiateMongoServer();
const app = express();

// PORT
const port = process.env.PORT || 8083;

//MIDDLEWARES
app.use(bodyParser.json());
app.use(cors());
app.use("/v1/user", user);
app.use("/v1/supply-request", supplyRequest);
app.use("/v1/cart", cart);

app.get("/v1/", (req, res) => {
  // res.send(
  //   "welcome to the express boilerplate provided by your friendly neighberhood belkacember"
  // );
  res.sendFile(path.join(__dirname + "/src/static/index.html"));
});

app.use(function (err, req, res, next) {
  console.dir(err);

  if (err) {
    // Your Error Status code and message here.
    res.status(err.statusCode ?? 500).json({
      message: err.message ?? "error ! ",
    });
  }

  // Send Some valid Response
});

app.listen(port, () => {
  console.log(`listening on port : ${port}`);
});