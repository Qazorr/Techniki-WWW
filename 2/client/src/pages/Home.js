import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

function Home() {
    const [listOfPosts, setListOfPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const { authState } = useContext(AuthContext);
    let navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login");
        } else {
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
    }, []);

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
                setListOfPosts(
                    listOfPosts.map((post) => {
                        if (post.id === PostId) {
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
                            className={`post ${likedPosts.includes(value.id) ? "likedPost" : ""}`}
                        >
                            <div className="title"> {value.title} </div>
                            <div
                                className="body"
                                onClick={() => {
                                    navigate(`/post/${value.id}`);
                                }}
                            >
                                {value.postText}
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
