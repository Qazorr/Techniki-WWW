import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// helpers
import { AuthContext } from "../helpers/AuthContext";

function Registration() {
    /* these values show in the input fields 
    when we open up registration page */
    const initialValues = {
        username: "",
        password: "",
        passwordConfirmation: "",
    };
    const { setAuthState } = useContext(AuthContext);

    // used for changing the location (e.g after succesfull registration)
    let navigate = useNavigate();

    // schema of how we want our data to look like
    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .min(3, "Username too short, must be at least 3 characters long")
            .max(16, "Username too long, must be at most 16 characters long")
            .matches(/^[aA-zZ\s]+$/, "Only latin alphabet characters allowed")
            .required("You must put a username containing 3-16 characters"),
        password: Yup.string()
            .min(4, "Password too short, must be at least 4 characters long")
            .max(20, "Password too long, must be at most 20 characters long")
            .required("You must put a password containing 4-20 characters"),
        passwordConfirmation: Yup.string().oneOf(
            [Yup.ref("password"), null],
            "Passwords must match"
        ),
    });

    /** Create new user and if succesfull log in to the system, else display error message */
    const onSubmit = (data) => {
        // try to make a POST request to create new user
        axios.post("http://localhost:9001/user", data).then((response) => {
            // something went wrong with registration
            if (response.data.error) alert(response.data.error);
            else {
                // use the credencials from registration to log in
                const credencials = {
                    username: data.username,
                    password: data.password,
                };
                // try to make a POST request to log in with given credencials
                axios
                    .post("http://localhost:9001/user/login", credencials)
                    .then((response) => {
                        if (response.data.error) alert(response.data.error);
                        else {
                            localStorage.setItem(
                                "accessToken",
                                response.data.token
                            );
                            setAuthState({
                                username: response.data.username,
                                id: response.data.id,
                                status: true,
                            });
                            navigate("/"); // after loggin in show homepage
                        }
                    });
            }
        });
    };

    return (
        <div className="registrationPage">
            {/* Registration form using Formik and Yup */}
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                <Form className="formContainer">
                    <legend>Sign up</legend>
                    <label>Username:</label>
                    <ErrorMessage name="username" component="span" />
                    <Field
                        id="inputRegisterUsername"
                        name="username"
                        placeholder="(Ex. John123...)"
                    />
                    <label>Password:</label>
                    <ErrorMessage name="password" component="span" />
                    <Field
                        id="inputRegisterPassword"
                        name="password"
                        type="password"
                        placeholder="Your Password..."
                    />
                    <label>Confirm password:</label>
                    <ErrorMessage name="passwordConfirmation" component="span" />
                    <Field
                        id="inputRegisterPasswordConfirmation"
                        name="passwordConfirmation"
                        type="password"
                        placeholder="Your Password..."
                    />
                    <button type="submit" className="registerBttn">
                        Register
                    </button>
                </Form>
            </Formik>
        </div>
    );
}

export default Registration;
