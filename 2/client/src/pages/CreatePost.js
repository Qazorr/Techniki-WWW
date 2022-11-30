import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function CreatePost() {
    const { authState } = useContext(AuthContext);
    let navigate = useNavigate();

    const initialValues = {
        title: "",
        postText: "",
    };

    const onSubmit = (data) => {
        axios
            .post("http://localhost:9001/posts", data, {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                },
            })
            .then((response) => {
                navigate("/");
            });
    };

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("You must input a title"),
        postText: Yup.string().required("You must input post text"),
    });

    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login");
        }
    }, []);

    return (
        <div className="createPostPage">
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                <Form className="formContainer">
                    <legend>Create Post</legend>
                    <label>Title:</label>
                    <ErrorMessage name="title" component="span" />
                    <Field
                        id="inputCreatePostTitle"
                        name="title"
                        placeholder="(Ex. Title...)"
                    />
                    <label>Post:</label>
                    <ErrorMessage name="postText" component="span" />
                    <Field
                        id="inputCreatePostText"
                        name="postText"
                        placeholder="(Ex. Post...)"
                    />
                    <button type="submit">Create Post</button>
                </Form>
            </Formik>
        </div>
    );
}

export default CreatePost;
