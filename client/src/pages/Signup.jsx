import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";
import { UserPlus, AlertCircle } from "lucide-react";
import * as yup from 'yup';

const signupSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  role: yup
    .string()
    .required('Role is required')
    .oneOf(['user', 'admin'], 'Invalid role')
});

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
    });
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error for this field when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors({ ...fieldErrors, [name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setFieldErrors({});
        setLoading(true);

        try {
            // Validate form data
            await signupSchema.validate(formData, { abortEarly: false });

            // If validation passes, attempt signup
            const user = await signup(
                formData.name,
                formData.email,
                formData.password,
                formData.role
            );
            navigate(user.role === "admin" ? "/admin/dashboard" : "/tasks");
        } catch (err) {
            if (err.name === 'ValidationError') {
                // Convert yup errors to object format
                const errors = {};
                err.inner.forEach(error => {
                    errors[error.path] = error.message;
                });
                setFieldErrors(errors);
            } else {
                // Handle API errors
                const errorMessage = err.response?.data?.message || err.message || "Signup failed. Please try again.";
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white py-8">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg border border-blue-100">
                <div className="flex items-center justify-center mb-8">
                    <UserPlus className="text-blue-600 mr-3" size={32} />
                    <h1 className="text-3xl font-bold text-gray-800">
                        Sign Up
                    </h1>
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
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                                fieldErrors.name
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                            }`}
                        />
                        {fieldErrors.name && (
                            <div className="flex items-center mt-1 text-red-600 text-sm">
                                <AlertCircle size={14} className="mr-1" />
                                <span>{fieldErrors.name}</span>
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
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

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
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

                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                                fieldErrors.confirmPassword
                                    ? 'border-red-500 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                            }`}
                        />
                        {fieldErrors.confirmPassword && (
                            <div className="flex items-center mt-1 text-red-600 text-sm">
                                <AlertCircle size={14} className="mr-1" />
                                <span>{fieldErrors.confirmPassword}</span>
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                            Role
                        </label>
                        <div className="relative">
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 transition appearance-none bg-white cursor-pointer shadow-sm ${
                                    fieldErrors.role
                                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                        : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300'
                                }`}
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 0.75rem center',
                                    backgroundSize: '1.25rem'
                                }}
                            >
                                <option value="user" className="py-3 px-4 hover:bg-blue-50">User</option>
                                <option value="admin" className="py-3 px-4 hover:bg-blue-50">Admin</option>
                            </select>
                        </div>
                        {fieldErrors.role && (
                            <div className="flex items-center mt-1 text-red-600 text-sm">
                                <AlertCircle size={14} className="mr-1" />
                                <span>{fieldErrors.role}</span>
                            </div>
                        )}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition duration-200">
                        {loading ? "Creating account..." : "Sign Up"}
                    </motion.button>
                </form>

                <p className="mt-6 text-center text-gray-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-blue-600 hover:text-blue-700">
                        Login
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
