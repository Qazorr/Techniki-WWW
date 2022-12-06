import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// helpers
import { AuthContext } from "../helpers/AuthContext";

// icons
import FavoriteIcon from "@mui/icons-material/Favorite";

function Profile() {
    /* we can get the id of the user we want to display from the URL
       e.g we want to see profile of user with id 1: http://.../profile/1 */
    let { id } = useParams();

    const [username, setUsername] = useState("");
    const [listOfPosts, setListOfPosts] = useState([]);
    const { authState } = useContext(AuthContext);

    // used for changing the location (e.g after clicking the post)
    let navigate = useNavigate();

    // get user info and user posts
    useEffect(() => {
        // info
        axios.get(`http://localhost:9001/user/info/${id}`).then((response) => {
            setUsername(response.data.username);
        });

        // posts
        axios
            .get(`http://localhost:9001/posts/byUserId/${id}`)
            .then((response) => {
                setListOfPosts(response.data);
            });
    }, []); // run only on the first render

    return (
        <div className="profilePage">
            <div className="basicInfo">
                <h1>Hello {username}!</h1>
                {/* Show only if the user is the same user as logged in */}
                {authState.username === username && (
                    <button
                        onClick={() => {
                            navigate("/changepassword");
                        }}
                        className="changepasswordBttn"
                    >
                        Change Password
                    </button>
                )}
            </div>
            <div className="posts">
                {/* Go through all user posts and display them */}
                {listOfPosts.map((value, key) => {
                    return (
                        <div key={key} className="post">
                            <div className="title"> {value.title} </div>
                            <div
                                className="body"
                                onClick={() => {
                                    navigate(`/post/${value.id}`);
                                }} // if post is clicked go to the single post page
                            >
                                {value.postText}
                            </div>
                            <div className="footer">
                                <div className="username">{value.username}</div>
                                <div className="buttons">
                                    <FavoriteIcon className="likeBttn" />
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

export default Profile;
