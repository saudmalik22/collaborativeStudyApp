import { useState } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import {useDispatch} from "react-redux";
import {signUp} from "../../store/slices/authSlice.js";

export const SignIn = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [errors, setErrors] = useState({});
     const dispatch = useDispatch();
    // Define the validation schema
    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .min(3, "Username must be at least 3 characters")
            .required("Username is required"),
        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
    });

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
        } else {
            setProfileImage(null);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
         let user={
             username,
             email,
             password,

         }
        try {
            await validationSchema.validate(user, { abortEarly: false });
            dispatch(signUp({user,profileImage}));
            setErrors({});
            console.log("Form submitted successfully:", { username, email, password });
            // Submit form logic here
        } catch (validationErrors) {
            const formattedErrors = {};
            validationErrors.inner.forEach((error) => {
                formattedErrors[error.path] = error.message;
            });
            setErrors(formattedErrors);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div

                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

                {/* Username Field */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
                    />
                    {errors.username && <p className="text-red-600 text-sm">{errors.username}</p>}
                </div>

                {/* Email Field */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
                    />
                    {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
                    />
                    {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
                </div>

                {/* Profile Picture Field */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="profilePicture">Profile Picture</label>
                    <input
                        type="file"
                        id="profilePicture"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>

                {/* Image Preview */}
                {profileImage && (
                    <div className="mb-4 text-center">
                        <img
                            src={URL.createObjectURL(profileImage)}
                            alt="Profile Preview"
                            className="w-24 h-24 object-cover rounded-full mx-auto border border-gray-300"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"

               onClick={handleSubmit}
                >
                    Sign Up
                </button>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-500 hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
