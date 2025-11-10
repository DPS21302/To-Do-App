import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import api from "../utils/api";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [userStats, setUserStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersResponse, statsResponse] = await Promise.all([
                api.get("/admin/users"),
                api.get("/admin/user-stats"),
            ]);
            setUsers(usersResponse.data);
            setUserStats(statsResponse.data);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const getUserStats = (userId) => {
        return (
            userStats.find(
                (stat) => stat.userId.toString() === userId.toString()
            ) || {
                totalTasks: 0,
                completedTasks: 0,
                pendingTasks: 0,
            }
        );
    };

    if (loading) {
        return (
            <Layout>
                <div className="text-center text-2xl font-semibold text-gray-600">
                    Loading...
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    User Management
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                    Manage all users and view their task statistics
                </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
                <table className="w-full min-w-[640px]">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left font-bold">
                                Name
                            </th>
                            <th className="px-4 py-3 text-left font-bold">
                                Email
                            </th>
                            <th className="px-4 py-3 text-left font-bold">
                                Role
                            </th>
                            <th className="px-4 py-3 text-center font-bold">
                                Total Tasks
                            </th>
                            <th className="px-4 py-3 text-center font-bold">
                                Completed
                            </th>
                            <th className="px-4 py-3 text-center font-bold">
                                Pending
                            </th>
                            <th className="px-4 py-3 text-center font-bold">
                                Completion Rate
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => {
                            const stats = getUserStats(user._id);
                            const completionRate =
                                stats.totalTasks > 0
                                    ? (
                                          (stats.completedTasks /
                                              stats.totalTasks) *
                                          100
                                      ).toFixed(0)
                                    : 0;

                            return (
                                <motion.tr
                                    key={user._id}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.2,
                                        delay: index * 0.03,
                                    }}
                                    className="border-t border-gray-200 hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 font-semibold text-gray-800">
                                        {user.name}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {user.email}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                user.role === "admin"
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-100 text-gray-700 border border-gray-300"
                                            }`}>
                                            {user.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center font-semibold text-gray-800">
                                        {stats.totalTasks}
                                    </td>
                                    <td className="px-4 py-3 text-center text-gray-700">
                                        {stats.completedTasks}
                                    </td>
                                    <td className="px-4 py-3 text-center text-gray-700">
                                        {stats.pendingTasks}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="w-24 bg-gray-200 h-6 rounded overflow-hidden mr-2">
                                                <div
                                                    className="bg-blue-600 h-full"
                                                    style={{
                                                        width: `${completionRate}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="font-semibold text-gray-700">
                                                {completionRate}%
                                            </span>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {users.length === 0 && (
                <div className="text-center py-12 bg-white border border-gray-200 rounded-lg shadow-sm mt-6">
                    <p className="text-xl font-semibold text-gray-700">
                        No users found
                    </p>
                </div>
            )}
        </Layout>
    );
};

export default AdminUsers;
