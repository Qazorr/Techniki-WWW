const express = require("express");
const router = express.Router();
const { Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

/*  http://.../likes/
    POST method adds a like to a given post 
    after validating the user
*/
router.post("/", validateToken, async (req, res) => {
    const { PostId } = req.body;
    const UserId = req.user.id;

    // check if the like already exist
    const found = await Likes.findOne({
        where: {
            PostId: PostId,
            UserId: UserId,
        },
    });

    if (!found) {
        // if the like doesn't exist - create it (like the post)
        await Likes.create({
            PostId: PostId,
            UserId: UserId,
        });
        res.json({ liked: true });
    } else {
        // else delete it (dislike the post)
        await Likes.destroy({
            where: {
                PostId: PostId,
                UserId: UserId,
            },
        });
        res.json({ liked: false });
    }
});

module.exports = router;
