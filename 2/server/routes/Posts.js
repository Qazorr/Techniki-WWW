const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

/*  http://.../posts/
    POST method creates new post in the Posts table
    with given title and body and it also includes
    user id and username from validation
*/
router.post("/", validateToken, async (req, res) => {
    const post = req.body;
    post.UserId = req.user.id;
    post.username = req.user.username;
    await Posts.create(post);
    res.json(post);
});

/* http://.../posts/
    GET method returns list of posts and likes
*/
router.get("/", validateToken, async (req, res) => {
    // get all posts with likes table joined (all likes of the single post)
    const listOfPosts = await Posts.findAll({ include: [Likes] });
    const likedPosts = await Likes.findAll({
        // get all likes given by user
        where: {
            UserId: req.user.id,
        },
    });
    res.json({ listOfPosts: listOfPosts, likedPosts: likedPosts });
});

/*  http://.../posts/byId/{id}
    GET method returns a single post with given id
*/
router.get("/byId/:id", async (req, res) => {
    const id = req.params.id;
    const post = await Posts.findByPk(id);
    res.json(post);
});

/*  http://.../posts/byUserId/{id}
    GET method returns all posts of user with given id
    including their likes
*/
router.get("/byUserId/:id", async (req, res) => {
    const id = req.params.id;
    const listOfPosts = await Posts.findAll({
        where: { UserId: id },
        include: [Likes],
    });
    res.json(listOfPosts);
});

/*  http://.../posts/{postId}
    DELETE method deletes post with given id after
    validating the user
*/
router.delete("/:postId", validateToken, async (req, res) => {
    const postId = req.params.postId;
    await Posts.destroy({
        where: {
            id: postId,
        },
    });
    res.json("Post deleted succesfully");
});

/*  http://.../posts/postTitle
    PUT method changes post title after validating the user
*/
router.put("/postTitle", validateToken, async (req, res) => {
    const { newTitle, id } = req.body;
    await Posts.update(
        { title: newTitle },
        {
            where: {
                id: id,
            },
        }
    );
    res.json(newTitle);
});

/*  http://.../posts/postText
    PUT method changes post text after validating the user
*/
router.put("/postText", validateToken, async (req, res) => {
    const { newText, id } = req.body;
    await Posts.update(
        { postText: newText },
        {
            where: {
                id: id,
            },
        }
    );
    res.json(newText);
});

module.exports = router;
