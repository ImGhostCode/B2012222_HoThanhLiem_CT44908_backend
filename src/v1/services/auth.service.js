const { isValidObjectId, default: mongoose } = require("mongoose");
const User = require("../models/_User.model");
class AuthService {
    constructor() { }

    async isExistingUser(email) {
        let user = await User.findOne({ email }).select("-password");
        return user;
    }

    async registerUser(name, email) {
        const user = new User({ name, email });
        await user.save();
        return user;
    }
}

module.exports = AuthService;