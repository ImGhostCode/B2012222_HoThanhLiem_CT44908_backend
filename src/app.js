const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const ApiError = require("./v1/utils/ApiError");
const fs = require('fs');
const path = require("path");
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const session = require('express-session');
const { passportMiddleware } = require('./v1/middlewares/index.middleware');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for JSONPlaceholder',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'JSONPlaceholder',
      url: 'https://jsonplaceholder.typicode.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'contacts',
      description: 'Everything about your contacts',
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./src/v1/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
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

app.use(session({ secret: 'SESSION_SECRET', resave: false, saveUninitialized: false }));
app.use(passportMiddleware.initialize());
app.use(passportMiddleware.session());

//router
app.use("/api", require("./v1/routes/index.router"));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
