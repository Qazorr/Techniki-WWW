const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../middlewares/AuthMiddleware");

/* http://.../user/
    POST method creates new user with given 
    username and password specified in request body.
    The password is encrypted using bcrypt using 10 salt rounds

    If the user with given username already exists returns error,
    else message of success
*/
router.post("/", async (req, res) => {
    const { username, password } = req.body;

    // try to find user with given username
    const user = await Users.findOne({
        where: {
            username: username,
        },
    });

    if (user) res.json({ error: "User already exists" });
    else {
        // encrypt the password and add the user to Users table
        bcrypt.hash(password, 10).then((hash) => {
            Users.create({
                username: username,
                password: hash,
            });
            res.json("User created");
        });
    }
});

/* http://.../user/login
    POST method logs the user into the service when the user
    with username exists and the password given in the request body is correct.
*/
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    // try to find user with given username
    const user = await Users.findOne({
        where: {
            username: username,
        },
    });

    // no user with given username found
    if (!user) res.json({ error: "User doesn't exist" });
    else {
        // check the hash of the given password with the hash in database
        bcrypt.compare(password, user.password).then((matches) => {
            if (!matches)
                res.json({ error: "Wrong username and password combination" });
            else {
                // create the access token using JWT and secret key
                const accessToken = sign(
                    { username: user.username, id: user.id },
                    "KacperPiatkowski"
                );
                res.json({
                    token: accessToken,
                    username: user.username,
                    id: user.id,
                });
            }
        });
    }
});

/* http://.../user/auth
    GET method authenticates the user using middleware
*/
router.get("/auth", validateToken, (req, res) => {
    res.json(req.user);
});

/* http://.../user/info/{id}
    GET method returns info of the user
    with given id excluding the password
*/
router.get("/info/:id", async (req, res) => {
    const id = req.params.id;

    // find the user by primary key (id) without password
    const info = await Users.findByPk(id, {
        attributes: {
            exclude: ["password"],
        },
    });
    res.json(info);
});


/* http://.../user/changepassword
    PUT method changes the users password when the validation
    ends with success
*/
router.put("/changepassword", validateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    // find user so that we can compare the given password with the one in database
    const user = await Users.findOne({
        where: {
            username: req.user.username, // we get username from validiation
        },
    });

    // check the hash of the given password with the hash in database
    bcrypt.compare(oldPassword, user.password).then(async (matches) => {
        if (!matches) res.json({ error: "Wrong password entered" });
        else {
            // hash new password and update the password cell
            bcrypt.hash(newPassword, 10).then((hash) => {
                Users.update(
                    { password: hash },
                    {
                        where: {
                            username: req.user.username,
                        },
                    }
                );
                res.json("Success");
            });
        }
    });
});

module.exports = router;
