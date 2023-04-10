import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import firebaseApp from "../initFirebase"; // Import firebaseApp instead of initFirebase
import { useNavigate } from "react-router-dom";
import "./MyData.css";

const MyData = () => {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        birthdate: "",
        sex: "",
        password: "",
        repeatPassword: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.repeatPassword) {
            alert("Passwords don't match");
            return;
        }

        try {
            await firebaseApp
                .auth()
                .createUserWithEmailAndPassword(formData.email, formData.password);
            const user = firebase.auth().currentUser;
            await user.updateProfile({
                displayName: `${formData.firstname} ${formData.lastname}`,
            });
            // Save other user data to your database as needed

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
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Repeat password:
                    <input
                        type="password"
                        name="repeatPassword"
                        value={formData.repeatPassword}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Profile picture:
                    <input type="file" name="profilePicture" />
                </label>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};
export default MyData;