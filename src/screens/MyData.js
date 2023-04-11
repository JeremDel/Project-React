import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import firebaseApp from "../initFirebase"; // Import firebaseApp instead of initFirebase
import { useNavigate } from "react-router-dom";
import "./MyData.css";

const MyData = () => {
    // Initialize the form state with default values
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        birthdate: "",
        sex: "",
        password: "",
        repeatPassword: "",
    });

    // Use the useNavigate hook for navigation
    const navigate = useNavigate();

    // Handle changes in form fields
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.repeatPassword) {
            alert("Passwords don't match");
            return;
        }

        try {
            // Create a new user with the email and password
            await firebaseApp
                .auth()
                .createUserWithEmailAndPassword(formData.email, formData.password);
            // Get the current user
            const user = firebase.auth().currentUser;
            // Update the user profile with the display name
            await user.updateProfile({
                displayName: `${formData.firstname} ${formData.lastname}`,
            });
            // Navigate to the home page
            navigate("/");
        } catch (error) {
            // Show an error message
            alert(error.message);
        }
    };

    // Return the registration form JSX
    return (
        <div>
            <h2>Hi new member !</h2>
            <form className="my-data-form" onSubmit={handleSubmit}>
                <div className="row">
                    {/* Input fields for firstname and lastname */}
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
                {/* Input field for email */}
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
                    {/* Input fields for birthdate and sex */}
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
                        {/* Radio buttons for sex */}
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
                {/* Input field for password */}
                <label>
                    Password
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </label>
                {/* Input field for repeat password */}
                <label>
                    Repeat password:
                    <input
                        type="password"
                        name="repeatPassword"
                        value={formData.repeatPassword}
                        onChange={handleChange}
                    />
                </label>
                {/* Input field for profile picture */}
                <label>
                    Profile picture:
                    <input type="file" name="profilePicture" />
                </label>
                {/* Submit button for the form */}
                <button type="submit">Register</button>
            </form>
        </div>
    );
};
export default MyData;