import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";
import { Users, CheckSquare, TrendingUp, Calendar } from "lucide-react";
import Layout from "../components/Layout";
import api from "../utils/api";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const { data } = await api.get("/admin/stats");
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch dashboard stats:", error);
        } finally {
            setLoading(false);
        }
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

    const statusData =
        stats?.statusDistribution.map((item) => ({
            name: item.status,
            value: item.count,
        })) || [];

    const COLORS = ["#2563eb", "#60a5fa", "#93c5fd"];

    const weekComparison = [
        { name: "Last Week", value: stats?.tasksLastWeek || 0 },
        { name: "Previous Week", value: stats?.tasksPreviousWeek || 0 },
    ];

    return (
        <Layout>
            <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Admin Dashboard
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                    Overview of all tasks and users
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm font-semibold text-gray-600">
                                Total Tasks
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 text-gray-800">
                                {stats?.totalTasks || 0}
                            </p>
                        </div>
                        <CheckSquare className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.05 }}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm font-semibold text-gray-600">
                                Total Users
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 text-gray-800">
                                {stats?.totalUsers || 0}
                            </p>
                        </div>
                        <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm font-semibold text-gray-600">
                                Avg Tasks/User
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 text-gray-800">
                                {stats?.averageTasksPerUser || 0}
                            </p>
                        </div>
                        <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.15 }}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm font-semibold text-gray-600">
                                Last 7 Days
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 text-gray-800">
                                {stats?.tasksLastWeek || 0}
                            </p>
                        </div>
                        <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">
                        Task Status Distribution
                    </h2>
                    {statusData.length > 0 ? (
                        <ResponsiveContainer
                            width="100%"
                            height={350}
                            className="sm:h-[280px]">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="40%"
                                    labelLine={false}
                                    label={({ name, percent }) =>
                                        `${name}: ${(percent * 100).toFixed(
                                            0
                                        )}%`
                                    }
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value">
                                    {statusData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend
                                    verticalAlign="bottom"
                                    height={40}
                                    wrapperStyle={{ paddingTop: '20px' }}
                                />
                    
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center py-12 text-gray-500">
                            No data available
                        </p>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.25 }}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">
                        Weekly Comparison
                    </h2>
                    <div className="space-y-6 py-8">
                        {weekComparison.map((item, index) => (
                            <div key={index}>
                                <div className="flex justify-between mb-2">
                                    <span className="font-semibold text-gray-700">
                                        {item.name}
                                    </span>
                                    <span className="font-semibold text-gray-700">
                                        {item.value} tasks
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 h-8 rounded overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${
                                                (item.value /
                                                    Math.max(
                                                        ...weekComparison.map(
                                                            (w) => w.value
                                                        )
                                                    )) *
                                                100
                                            }%`,
                                        }}
                                        transition={{
                                            duration: 0.6,
                                            delay: 0.3 + index * 0.1,
                                        }}
                                        className="bg-blue-600 h-full"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="font-semibold text-gray-700">
                            {stats?.tasksPreviousWeek === 0 ? (
                                stats?.tasksLastWeek > 0 ? (
                                    <span className="text-green-700">
                                        ↑ {stats.tasksLastWeek} new tasks this week (no tasks in previous week)
                                    </span>
                                ) : (
                                    <span>No tasks in both weeks</span>
                                )
                            ) : stats?.tasksLastWeek > stats?.tasksPreviousWeek ? (
                                <span className="text-green-700">
                                    ↑{" "}
                                    {(
                                        ((stats.tasksLastWeek -
                                            stats.tasksPreviousWeek) /
                                            stats.tasksPreviousWeek) *
                                        100
                                    ).toFixed(0)}
                                    % increase from previous week
                                </span>
                            ) : stats?.tasksLastWeek <
                              stats?.tasksPreviousWeek ? (
                                <span className="text-red-700">
                                    ↓{" "}
                                    {(
                                        ((stats.tasksPreviousWeek -
                                            stats.tasksLastWeek) /
                                            stats.tasksPreviousWeek) *
                                        100
                                    ).toFixed(0)}
                                    % decrease from previous week
                                </span>
                            ) : (
                                <span>No change from previous week</span>
                            )}
                        </p>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
