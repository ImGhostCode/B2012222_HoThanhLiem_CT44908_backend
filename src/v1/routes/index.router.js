const express = require("express");
const router = express.Router();
const contactRouter = require("./contact.route");
const authRouter = require("./auth.route");
router.use("/contacts", contactRouter);
router.use("/auth", authRouter);

module.exports = router;
