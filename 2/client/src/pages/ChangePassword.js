import React, { useState } from "react";
import axios from "axios";

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const changePassword = () => {
        axios
            .put(
                "http://localhost:9001/auth/changepassword",
                {
                    oldPassword: oldPassword,
                    newPassword: newPassword,
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
                }
            });
    };

    return (
        <div className="changePasswordPage">
            <fieldset>
                <legend>Change Password</legend>
                <label>Old password</label>
                <input
                    type="text"
                    placeholder="Old password..."
                    onChange={(event) => {
                        setOldPassword(event.target.value);
                    }}
                />
                <label>New Password</label>
                <input
                    type="text"
                    placeholder="New password..."
                    onChange={(event) => {
                        setNewPassword(event.target.value);
                    }}
                />
                <button onClick={changePassword}> Save Changes </button>
            </fieldset>
        </div>
    );
}

export default ChangePassword;
