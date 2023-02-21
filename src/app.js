const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const ApiError = require("./v1/utils/ApiError");
const fs = require('fs');
const path = require("path");

//init dbs
// require('./v1/databases/init.redis')

//user middleware
app.use(helmet());
app.use(morgan("combined", { stream: fs.createWriteStream(path.join(__dirname, '/v1/logs/access.log')) }));
// compress responses
app.use(compression());

// add body-parser
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//router
app.use("/api", require("./v1/routes/index.router"));

// Error Handling Middleware called
app.use((req, res, next) => {
  next(new ApiError(404, "error", "Resource not found", null));
});

// error handler middleware
app.use((error, req, res, next) => {
  res.status(error.code || 500).json({
    code: error.code || 500,
    status: error.status,
    message: error.message || "Internal Server Error",
    data: error.data,
  });
});

module.exports = app;
