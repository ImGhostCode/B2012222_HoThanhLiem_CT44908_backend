const express = require("express");
const cors = require("cors");
const contactRouter = require("./app/routes/contact.route");

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//router
app.use("/api/contact", contactRouter);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to contact book application." });
});

module.exports = app;
