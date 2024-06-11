const express = require("express");
const router = express.Router();
const { authController } = require("../controllers/index.controller");
const { passportMiddleware } = require("../middlewares/index.middleware");

// Way 1
// router.route("/google/callback").get(authController.handleGoogleCallback)
// router.route("/google").get(authController.googleOAuth);

// Way 2
router.get('/google/callback', passportMiddleware.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    // Successful authentication, redirect or handle the user as desired
    res.status(200).json({ message: 'User authenticated successfully', user: req.user, token: req.token });
});

router.get('/google', passportMiddleware.authenticate('google', { scope: ['profile', 'email'] }));


module.exports = router;