import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// helpers
import { AuthContext } from "../helpers/AuthContext";

function Post() {
    /* we can get the id of the post we want to display from the URL
       e.g we want to see post with id 1: http://.../post/1 */
    let { id } = useParams();

    // used to immediately show edited post (optimistic UI update)
    const [postObject, setPostObject] = useState({});

    // used to immediately show new comments (optimistic UI update)
    const [comments, setComments] = useState([]);

    const [newComment, setNewComment] = useState("");
    const { authState } = useContext(AuthContext);

    // used for changing the location (e.g after deleting the post)
    let navigate = useNavigate();

    // get post specified by the id in URL and it's comments
    useEffect(() => {
        // post
        axios.get(`http://localhost:9001/posts/byId/${id}`).then((response) => {
            setPostObject(response.data);
        });

        // comments
        axios.get(`http://localhost:9001/comments/${id}`).then((response) => {
            setComments(response.data);
        });
    }, []); // run only on the first render

    /** Add new comment to the Comments table using current post id and state of newComment */
    const addComment = () => {
        // try to add the comment with passing accessToken in header for authentication
        axios
            .post(
                "http://localhost:9001/comments",
                {
                    commentBody: newComment,
                    PostId: id,
                },
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    },
                }
            )
            .then((response) => {
                if (response.data.error) {
                    alert(response.data.error);
                } else {
                    const commentToAdd = {
                        commentBody: newComment,
                        username: response.data.username,
                    };
                    // Add the comment to the rendered comments (optimistic UI update)
                    setComments([...comments, commentToAdd]);
                    setNewComment("");
                }
            });
    };

    /** Delete comment if you are the one who created it
     * @param {int} id id of the comment
     */
    const deleteComment = (id) => {
        // try to delete the comment with passing accessToken in header for authentication
        axios
            .delete(`http://localhost:9001/comments/${id}`, {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                },
            })
            .then(() => {
                // filter the deleted comment out (optimistic UI update)
                setComments(
                    comments.filter((val) => {
                        return val.id !== id;
                    })
                );
            });
    };

    /**
     * Delete post if you are the one who created it
     * @param {int} id id of the post
     */
    const deletePost = (id) => {
        // try to delete the post with passing accessToken in header for authentication
        axios
            .delete(`http://localhost:9001/posts/${id}`, {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                },
            })
            .then(() => {
                // move out to homepage
                navigate("/");
            });
    };

    /**
     * Edit post text
     * @param {string} option what to modify (title/body)
     */
    const editPost = (option) => {
        if (option === "title") {
            // get new title using prompt()
            let newTitle = prompt("Enter new title:");

            // if the new title is not empty update it
            if (newTitle) {
                axios.put(
                    "http://localhost:9001/posts/postTitle",
                    { newTitle: newTitle, id: id },
                    {
                        headers: {
                            accessToken: localStorage.getItem("accessToken"),
                        },
                    }
                );
                setPostObject({ ...postObject, title: newTitle });
            } else {
                alert("You must put some title");
            }
        } else {
            // get new body using prompt()
            let newPostText = prompt("Enter new text:");

            // if the new body is not empty update it
            if (newPostText) {
                axios.put(
                    "http://localhost:9001/posts/postText",
                    { newText: newPostText, id: id },
                    {
                        headers: {
                            accessToken: localStorage.getItem("accessToken"),
                        },
                    }
                );
                setPostObject({ ...postObject, postText: newPostText });
            } else {
                alert("You must put some text");
            }
        }
    };

    return (
        <div className="postPage">
            <div className="leftSide">
                <div className="post" id="individual">
                    <div
                        className="title"
                        onClick={() => {
                            if (authState.username === postObject.username) {
                                editPost("title");
                            }
                        }}
                    >
                        {postObject.title}
                    </div>
                    <div
                        className="body"
                        onClick={() => {
                            if (authState.username === postObject.username) {
                                editPost("body");
                            }
                        }}
                    >
                        {postObject.postText}
                    </div>
                    <div className="footer">
                        {postObject.username}
                        {authState.username === postObject.username && (
                            <button
                                className="deleteBttn deletePostBttn"
                                onClick={() => deletePost(postObject.id)}
                            >
                                X
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="rightSide">
                <div className="addCommentContainer">
                    <input
                        type="text"
                        placeholder="Comment..."
                        autoComplete="off"
                        value={newComment}
                        onChange={(event) => {
                            setNewComment(event.target.value);
                        }}
                    />
                    <button className="addCommentBttn" onClick={addComment}>
                        Add Comment
                    </button>
                </div>
                <div className="listOfComments">
                    {comments.map((comment, key) => {
                        return (
                            <div key={key} className="comment">
                                <label className="username">
                                    {comment.username}
                                </label>
                                <p className="commentBody">
                                    {comment.commentBody}
                                </p>
                                {authState.username === comment.username && (
                                    <button
                                        className="deleteBttn deleteCommentBttn"
                                        onClick={(id) =>
                                            deleteComment(comment.id)
                                        }
                                    >
                                        X
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Post;
