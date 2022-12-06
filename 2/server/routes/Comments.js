const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

/* http://.../comments/
    POST method creates new comment in Comment table
    with given text and it also includes 
    username of the person commenting from validation
*/
router.post("/", validateToken, async (req, res) => {
    const comment = req.body;
    const username = req.user.username;
    comment.username = username;
    await Comments.create(comment);
    res.json(comment);
});

/* http://.../comments/{postId}
    GET method returns all comments all comments
    posted under a post with given id
*/
router.get("/:postId", async (req, res) => {
    const postId = req.params.postId;
    const comments = await Comments.findAll({
        where: {
            PostId: postId,
        },
    });
    res.json(comments);
});

/*  http://.../comments/{commentId}
    DELETE method deletes comment with given id 
*/
router.delete("/:commentId", validateToken, async (req, res) => {
    const commentId = req.params.commentId;
    await Comments.destroy({
        where: {
            id: commentId,
        },
    });
    res.json("Comment deleted succesfully");
});

module.exports = router;
