const { verify } = require("jsonwebtoken");

/**
 * Validate the user using JWT token given in the request header and secret key
 */
const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");

    // when the accessToken is not present immediately end verification with error
    if (!accessToken) return res.json({ error: "User not logged in" });
    try {
        // verify the accessToken with the secret key
        const validToken = verify(accessToken, "KacperPiatkowski");
        if (validToken) {
            // validation was succesfull
            req.user = validToken;
            return next();
        }
    } catch (err) {
        return res.json({ error: err });
    }
};

module.exports = { validateToken };
