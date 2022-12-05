import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function Registration() {
    const initialValues = {
        username: "",
        password: "",
    };

    const { setAuthState } = useContext(AuthContext);
    let navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .min(3)
            .max(16)
            .required("You must put a username containing 3-16 characters"),
        password: Yup.string()
            .min(4)
            .max(20)
            .required("You must put a password containing 4-20 characters"),
    });

    const onSubmit = (data) => {
        axios.post("http://localhost:9001/auth", data).then((response) => {
            if (response.data.error) alert(response.data.error);
            else {
                const credencials = {
                    username: data.username,
                    password: data.password,
                };
                axios
                    .post("http://localhost:9001/auth/login", credencials)
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
                            navigate("/");
                        }
                    });
            }
        });
    };

    return (
        <div className="registrationPage">
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
                    <button type="submit" className="registerBttn">
                        Register
                    </button>
                </Form>
            </Formik>
        </div>
    );
}

export default Registration;
