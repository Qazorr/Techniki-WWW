import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import FavoriteIcon from "@mui/icons-material/Favorite";

function Profile() {
    let { id } = useParams();
    const [username, setUsername] = useState("");
    const [listOfPosts, setListOfPosts] = useState([]);
    const { authState } = useContext(AuthContext);

    let navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:9001/auth/info/${id}`).then((response) => {
            setUsername(response.data.username);
        });

        axios
            .get(`http://localhost:9001/posts/byUserId/${id}`)
            .then((response) => {
                setListOfPosts(response.data);
            });
    }, []);

    return (
        <div className="profilePageContainer">
            <div className="basicInfo">
                <h1>Username: {username}</h1>
                {authState.username === username && (
                    <button
                        onClick={() => {
                            navigate("/changepassword");
                        }}
                    >
                        {" "}
                        Change Password
                    </button>
                )}
            </div>
            <div className="listOfPosts">
                {listOfPosts.map((value, key) => {
                    return (
                        <div key={key} className="post">
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
                                <div className="username">{value.username}</div>
                                <div className="buttons">
                                    <FavoriteIcon />
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