import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import firebaseApp from "../initFirebase"; // Import firebaseApp instead of initFirebase
import { useNavigate } from "react-router-dom";
import "./MyData.css";

// The MyData component is responsible for rendering the registration form for new users.
const MyData = () => {
    // State hook to manage the form data entered by the user
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        birthdate: "",
        sex: "",
        password: "",
        repeatPassword: "",
    });

    // Hook to navigate to different routes in the application
    const navigate = useNavigate();

    // Handle change event of the form inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle submit event of the form
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Check if passwords match
        if (formData.password !== formData.repeatPassword) {
            alert("Passwords don't match");
            return;
        }

        try {
            // Create a new user with email and password
            await firebaseApp
                .auth()
                .createUserWithEmailAndPassword(formData.email, formData.password);
            // Get the current user
            const user = firebase.auth().currentUser;
            // Update the user's display name
            await user.updateProfile({
                displayName: `${formData.firstname} ${formData.lastname}`,
            });


            // Navigate to the homepage
            navigate("/");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div>
            <h2>Hi new member !</h2>
            <form className="my-data-form" onSubmit={handleSubmit}>
                <div className="row">
                    <label className="half-width">
                        Firstname:
                        <input
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            placeholder="Name"
                        />
                    </label>
                    <label className="half-width">
                        Lastname:
                        <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            placeholder="Lastname"
                        />
                    </label>
                </div>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@address.com"
                    />
                </label>
                <div className="row">
                    <label className="half-width">
                        Birthdate:
                        <input
                            type="date"
                            name="birthdate"
                            value={formData.birthdate}
                            onChange={handleChange}
                        />
                    </label>
                    <div className="sex">
                        <span>Sex:</span>
                        {/* Radio buttons for selecting the user's sex */}
                        <label>
                            <input
                                type="radio"
                                name="sex"
                                value="Woman"
                                onChange={handleChange}
                            />
                            Woman
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="sex"
                                value="Man"
                                onChange={handleChange}
                            />
                            Man
                        </label>
                    </div>
                </div>
                <label>
                    Password
                    {/* Input for entering password */}
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Repeat password:
                    {/* Input for re-entering password */}
                    <input
                        type="password"
                        name="repeatPassword"
                        value={formData.repeatPassword}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Profile picture:
                    {/* Input for uploading a profile picture */}
                    <input type="file" name="profilePicture" />
                </label>
                {/* Submit button */}
                <button type="submit">Register</button>
            </form>
        </div>
    );
};
export default MyData;