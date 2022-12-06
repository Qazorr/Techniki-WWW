import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function CreatePost() {
    // used for changing the location (e.g after succesfull creation of the post)
    let navigate = useNavigate();

    /* these values show in the input fields 
    when we open up create post page */
    const initialValues = {
        title: "",
        postText: "",
    };

    // schema of how we want our data to look like
    const validationSchema = Yup.object().shape({
        title: Yup.string().required("You must input a title"),
        postText: Yup.string().required("You must input post text"),
    });

    /** Create new post
     * @param data title and text of the post
     */
    const onSubmit = (data) => {
        // try to make a post
        axios
            .post("http://localhost:9001/posts", data, {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                },
            })
            .then(() => {
                navigate("/"); // redirect user to homepage
            });
    };

    // if the user is not logged in redirect to login page
    useEffect(() => {
        if (!localStorage.getItem("accessToken")) {
            navigate("/login");
        }
    }, []); // run only on the first render

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
                        placeholder="(Ex.: I love Techniki WWW)"
                    />
                    <label>Post:</label>
                    <ErrorMessage name="postText" component="span" />
                    <Field
                        id="inputCreatePostText"
                        name="postText"
                        placeholder="(Ex.: Node.js is also very cool)"
                    />
                    <button type="submit">Create Post</button>
                </Form>
            </Formik>
        </div>
    );
}

export default CreatePost;
