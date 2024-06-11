const AuthService = require("../services/auth.service");
const ApiError = require("../utils/ApiError");

module.exports = {
    googleOAuth: async (req, res, next) => {
        try {
            const GOOGLE_OAUTH_URL = process.env.GOOGLE_OAUTH_URL;

            const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

            const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL

            const GOOGLE_OAUTH_SCOPES = [
                "https://www.googleapis.com/auth/userinfo.email",
                "https://www.googleapis.com/auth/userinfo.profile",
            ];

            const state = "some_state";
            const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
            const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${GOOGLE_OAUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;
            res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
        } catch (error) {
            return next(
                new ApiError(
                    500,
                    "error",
                    "An error ocurred while retrieving favorite contacts",
                    null
                )
            );
        }
    },

    handleGoogleCallback: async (req, res, next) => {
        try {
            const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
            const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
            const GOOGLE_ACCESS_TOKEN_URL = process.env.GOOGLE_ACCESS_TOKEN_URL;
            const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL

            const { code } = req.query;

            const data = {
                code,
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: GOOGLE_CALLBACK_URL,
                grant_type: "authorization_code",
            };

            // exchange authorization code for access token & id_token

            const response = await fetch(GOOGLE_ACCESS_TOKEN_URL, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const access_token_data = await response.json();

            const { id_token } = access_token_data;

            // verify and extract the information in the id token

            const token_info_response = await fetch(
                `${process.env.GOOGLE_TOKEN_INFO_URL}?id_token=${id_token}`
            );

            const token_info_data = await token_info_response.json()

            const { email, name } = token_info_data;
            const authService = new AuthService();
            let user = await authService.isExistingUser(email);
            if (!user) {
                user = await authService.registerUser(name, email);
            }
            const token = user.generateToken();
            return res.status(token_info_response.status).json({ user, token });
        } catch (error) {
            return next(
                new ApiError(
                    500,
                    "error",
                    "An error ocurred while retrieving favorite contacts",
                    null
                )
            );
        }
    }
};