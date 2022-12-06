import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// helpers
import { AuthContext } from "../helpers/AuthContext";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setAuthState } = useContext(AuthContext);

    // used for changing the location (e.g after loging in)
    let navigate = useNavigate();

    /** Log in using credentials given in input fields */
    const login = () => {
        // using data from the input fields try to log in
        const data = { username: username, password: password };
        axios
            .post("http://localhost:9001/user/login", data)
            .then((response) => {
                // if the loggin in didn't go through
                if (response.data.error) alert(response.data.error);
                else {
                    // add accessToken to localStorage and set authentication state to 'authenticated'
                    localStorage.setItem("accessToken", response.data.token);
                    setAuthState({
                        username: response.data.username,
                        id: response.data.id,
                        status: true,
                    });
                    navigate("/"); // navigate to homepage
                }
            });
    };

    return (
        <div className="loginPage">
            <fieldset>
                <legend>Sign in</legend>
                <label>Username</label>
                <input
                    type="text"
                    onChange={(event) => {
                        setUsername(event.target.value);
                    }}
                />
                <label>Password</label>
                <input
                    type="password"
                    onChange={(event) => {
                        setPassword(event.target.value);
                    }}
                />

                <button onClick={login}> Login </button>
            </fieldset>
        </div>
    );
}

export default Login;
