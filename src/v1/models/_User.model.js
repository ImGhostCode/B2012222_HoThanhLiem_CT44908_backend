const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "Please provide a  name"],
        minlength: 3,
        maxlength: 56,
    },
    email: {
        type: String,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email.",
        ],
        unique: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: false,
    },
});

UserSchema.methods.generateToken = function () {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME,
    });
    return token;
};

module.exports = mongoose.model("users", UserSchema);