import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

function Registration() {
    const initialValues = {
        username: "",
        password: "",
    };

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
        axios.post("http://localhost:9001/auth", data).then(() => {
            console.log(data);
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
                        id="inputCreatePost"
                        name="username"
                        placeholder="(Ex. John123...)"
                    />
                    <label>Password:</label>
                    <ErrorMessage name="password" component="span" />
                    <Field
                        id="inputCreatePost"
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
