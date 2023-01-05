const express = require("express");
const cors = require("cors");
const contactRouter = require("./app/routes/contact.route");
const ApiError = require("./app/api-error");
const app = express();

//middleware
app.use(cors());
app.use(express.json());

//router
app.use("/api/contact", contactRouter);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to contact book application." });
});

app.use((req, res, next) => {
  next(new ApiError(404, "Resource not found"));
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
