const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AuthService = require("../services/auth.service");
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,

        },
        async (accessToken, refreshToken, profile, done) => {
            // Code to handle user authentication and retrieval
            const { name, email } = profile._json;
            const authService = new AuthService();
            let user = await authService.isExistingUser(email);
            if (!user) {
                user = await authService.registerUser(name, email);
            }
            const token = await user.generateToken();
            return done(null, { user, token });
        }
    )
);

passport.serializeUser(({ user, token }, done) => {
    // Code to serialize user data
    done(null, { user, token });
});

passport.deserializeUser((id, done) => {
    // Code to deserialize user data
});

module.exports = passport;