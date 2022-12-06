import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

// components
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Profile from "./pages/Profile";
import PageNotFound from "./pages/PageNotFound";
import ChangePassword from "./pages/ChangePassword";

// helpers
import { AuthContext } from "./helpers/AuthContext";

function App() {
    const [authState, setAuthState] = useState({
        username: "", //user username
        id: 0, // user id
        status: false, // succesfully validated?
    });

    // get user current authentication state using '/user/auth' endpoint
    useEffect(() => {
        axios
            .get("http://localhost:9001/user/auth", {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                },
            })
            .then((response) => {
                if (response.data.error) {
                    // authentication wasn't succesfull
                    setAuthState({ ...authState, status: false });
                } else {
                    // authentication was succesfull
                    setAuthState({
                        username: response.data.username,
                        id: response.data.id,
                        status: true,
                    });
                }
            });
    }, []); // run only on the first render

    /** logging out removes the JWT accessToken from the local storage and changes the authentication state to 'not authenticated' */
    const logout = () => {
        localStorage.removeItem("accessToken");
        setAuthState({
            username: "",
            id: 0,
            status: false,
        });
    };

    return (
        <div className="App">
            <AuthContext.Provider value={{ authState, setAuthState }}>
                <Router>
                    <div className="navbar">
                        <div className="links">
                            {/* Depending on whether user is logged in or not we
                            display login/registration buttons or Home/Create Post buttons */}
                            {!authState.status ? (
                                <>
                                    <Link to="/login"> Login </Link>
                                    <Link to="/registration">Registration</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/" className="logo">
                                        Home
                                    </Link>
                                    <Link to="/createpost">Create A Post</Link>
                                </>
                            )}
                        </div>
                        <div className="loggedInContainer">
                            <div className="username">
                                {/* When clicked on username take to the user profile */}
                                <Link to={`/profile/${authState.id}`}>
                                    {authState.username}
                                </Link>
                            </div>
                            {/* If the user is logged in show the logout button */}
                            {authState.status && (
                                <Link
                                    to="/login"
                                    onClick={logout}
                                    className="logoutBttn"
                                >
                                    Logout
                                </Link>
                            )}
                        </div>
                    </div>
                    {/* Routes to the components */}
                    <Routes>
                        <Route path="/" exact element={<Home />} />
                        <Route
                            path="/createpost"
                            exact
                            element={<CreatePost />}
                        />
                        <Route path="/post/:id" exact element={<Post />} />
                        <Route path="/login" exact element={<Login />} />
                        <Route
                            path="/registration"
                            exact
                            element={<Registration />}
                        />
                        <Route
                            path="/profile/:id"
                            exact
                            element={<Profile />}
                        />
                        <Route
                            path="/changepassword"
                            exact
                            element={<ChangePassword />}
                        />
                        {/* If no valid endpoint chosen redirect to this component */}
                        <Route path="*" exact element={<PageNotFound />} />
                    </Routes>
                </Router>
            </AuthContext.Provider>
        </div>
    );
}

export default App;
