import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import firebaseApp from "../initFirebase"; // Import firebaseApp instead of initFirebase
import { useNavigate } from "react-router-dom";

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
            <h2>Hi new Member</h2>
            <form onSubmit={handleSubmit}>
                {/* Add form fields here */}
                {/* Example: */}
                <label>
                    First Name:
                    <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                    />
                </label>
                {/* Add other form fields similarly */}
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default MyData;