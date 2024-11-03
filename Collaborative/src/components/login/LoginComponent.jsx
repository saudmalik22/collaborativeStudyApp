import { Link } from "react-router-dom";
import { useState } from "react";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/authSlice.js";

export const LoginComponent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});

    const schema = Yup.object().shape({
        email: Yup.string().email("Invalid email format").required("Email is required"),
        password: Yup.string().required("Password is required"),
    });

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("button is clicked");

        let user = { email, password };
        console.log("user in component", user);

        try {
            // Validate user data
            await schema.validate(user, { abortEarly: false });
            setErrors({}); // Clear any existing errors if validation passes

            // Dispatch login action
            await dispatch(login(user));
        } catch (validationErrors) {
            // Handle validation errors
            const formattedErrors = {};
            validationErrors.inner.forEach((error) => {
                formattedErrors[error.path] = error.message;
            });
            setErrors(formattedErrors);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                {/* Email Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                {/* Password Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="button"
                    className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
                    onClick={handleLogin}
                >
                    Login
                </button>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-blue-500 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
