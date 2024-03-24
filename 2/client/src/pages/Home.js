import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

// icons
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

function Home() {
    const [listOfPosts, setListOfPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);

    // used for changing the location (e.g after trying to access homepage without being logged in)
    let navigate = useNavigate();

    // try to render the posts
    useEffect(() => {
        // if the user is not logged in we can't access the posts
        if (!localStorage.getItem("accessToken")) {
            navigate("/login"); // redirect user to login page
        } else {
            // try to get all the posts with passing accessToken in header for authentication
            axios
                .get("http://localhost:9001/posts", {
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    },
                })
                .then((response) => {
                    setListOfPosts(response.data.listOfPosts);
                    setLikedPosts(
                        response.data.likedPosts.map((like) => {
                            return like.PostId;
                        })
                    );
                });
        }
    }, []); // run only on the first render

    /**
     * Like the post if you are logged in
     * @param {int} PostId id of the post to like
     */
    const likePost = (PostId) => {
        axios
            .post(
                "http://localhost:9001/likes",
                { PostId: PostId },
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    },
                }
            )
            .then((response) => {
                // depending on response (liked/disliked) we optimistically update the UI
                setListOfPosts(
                    listOfPosts.map((post) => {
                        if (post.id === PostId) {
                            // we only care about lenght
                            if (response.data.liked) {
                                return { ...post, Likes: [...post.Likes, 0] };
                            } else {
                                const likesArray = post.Likes;
                                likesArray.pop();
                                return { ...post, Likes: likesArray };
                            }
                        } else {
                            return post;
                        }
                    })
                );

                if (likedPosts.includes(PostId)) {
                    setLikedPosts(
                        likedPosts.filter((id) => {
                            return id !== PostId;
                        })
                    );
                } else {
                    setLikedPosts([...likedPosts, PostId]);
                }
            });
    };

    return (
        <div className="homePage">
            <div className="posts">
                {listOfPosts.map((value, key) => {
                    return (
                        <div
                            key={key}
                            className={`post ${
                                likedPosts.includes(value.id) ? "likedPost" : ""
                            }`}
                        >
                            <div className="title"> {value.title} </div>
                            <div
                                className="body"
                                onClick={() => {
                                    navigate(`/post/${value.id}`);
                                }}
                            >
                                <p className="postText"> {value.postText} </p>
                            </div>
                            <div className="footer">
                                <div className="username">
                                    <Link to={`/profile/${value.UserId}`}>
                                        {value.username}
                                    </Link>
                                </div>
                                <div className="buttons">
                                    {likedPosts.includes(value.id) ? (
                                        <FavoriteIcon
                                            onClick={() => {
                                                likePost(value.id);
                                            }}
                                            className="likeBttn"
                                        />
                                    ) : (
                                        <FavoriteBorderIcon
                                            onClick={() => {
                                                likePost(value.id);
                                            }}
                                            className="likeBttn"
                                        />
                                    )}
                                    <label> {value.Likes.length} </label>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Home;
