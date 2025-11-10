import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";
import { LogIn, AlertCircle } from "lucide-react";
import * as yup from 'yup';

const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
});

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate(user.role === "admin" ? "/admin/dashboard" : "/tasks");
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setFieldErrors({});
        setLoading(true);

        try {
            // Validate form data
            await loginSchema.validate({ email, password }, { abortEarly: false });

            // If validation passes, attempt login
            const user = await login(email, password);
            navigate(user.role === "admin" ? "/admin/dashboard" : "/tasks");
        } catch (err) {
            if (err.name === 'ValidationError') {
                // Frontend Yup validation errors
                const errors = {};
                err.inner.forEach(error => {
                    errors[error.path] = error.message;
                });
                setFieldErrors(errors);
            } else if (err.response?.data?.errors) {
                // Backend validation errors (field-specific)
                setFieldErrors(err.response.data.errors);
            } else {
                // Handle API errors (general errors)
                const errorMessage = err.response?.data?.message || err.message || "Login failed. Please try again.";
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border border-blue-100">
                <div className="flex items-center justify-center mb-8">
                    <LogIn className="text-blue-600 mr-3" size={32} />
                    <h1 className="text-3xl font-bold text-gray-800">Login</h1>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (fieldErrors.email) {
                                    setFieldErrors({ ...fieldErrors, email: null });
                                }
                            }}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                                fieldErrors.email
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                            }`}
                        />
                        {fieldErrors.email && (
                            <div className="flex items-center mt-1 text-red-600 text-sm">
                                <AlertCircle size={14} className="mr-1" />
                                <span>{fieldErrors.email}</span>
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (fieldErrors.password) {
                                    setFieldErrors({ ...fieldErrors, password: null });
                                }
                            }}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                                fieldErrors.password
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                            }`}
                        />
                        {fieldErrors.password && (
                            <div className="flex items-center mt-1 text-red-600 text-sm">
                                <AlertCircle size={14} className="mr-1" />
                                <span>{fieldErrors.password}</span>
                            </div>
                        )}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition duration-200">
                        {loading ? "Logging in..." : "Login"}
                    </motion.button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="font-semibold text-blue-600 hover:text-blue-700">
                        Sign Up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
