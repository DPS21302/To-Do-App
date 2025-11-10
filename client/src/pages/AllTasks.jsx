import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Grid, List } from "lucide-react";
import Layout from "../components/Layout";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import api from "../utils/api";

const AllTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [viewMode, setViewMode] = useState("list");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            setFilteredTasks(
                tasks.filter((task) =>
                    task.title.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else {
            setFilteredTasks(tasks);
        }
    }, [searchTerm, tasks]);

    const fetchTasks = async () => {
        try {
            const { data } = await api.get("/tasks");
            setTasks(data);
            setFilteredTasks(data);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveTask = async (formData, taskId) => {
        try {
            if (taskId) {
                await api.put(`/tasks/${taskId}`, formData);
            } else {
                await api.post("/tasks", formData);
            }
            fetchTasks();
        } catch (error) {
            console.error("Failed to save task:", error);
            // Re-throw error so TaskModal can handle it
            throw error;
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await api.delete(`/tasks/${taskId}`);
                fetchTasks();
            } catch (error) {
                console.error("Failed to delete task:", error);
            }
        }
    };

    const handleToggleComplete = async (task) => {
        const newStatus = task.status === "completed" ? "pending" : "completed";
        try {
            await api.put(`/tasks/${task._id}`, { status: newStatus });
            fetchTasks();
        } catch (error) {
            console.error("Failed to update task:", error);
        }
    };

    const handleEditTask = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleNewTask = () => {
        setSelectedTask(null);
        setIsModalOpen(true);
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
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    All Tasks
                </h1>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                    <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 transition ${
                                viewMode === "list"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}>
                            <List size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 transition ${
                                viewMode === "grid"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}>
                            <Grid size={20} />
                        </button>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleNewTask}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150">
                        <Plus size={20} />
                        <span>New Task</span>
                    </motion.button>
                </div>
            </div>

            <div className="mb-4 sm:mb-6">
                <div className="relative">
                    <Search
                        className="absolute left-3 top-3 text-gray-400"
                        size={20}
                    />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                </div>
            </div>

            {filteredTasks.length === 0 ? (
                <div className="text-center py-12 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <p className="text-xl font-semibold text-gray-700 mb-4">
                        No tasks found
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleNewTask}
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150">
                        Create Your First Task
                    </motion.button>
                </div>
            ) : (
                <div
                    className={
                        viewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            : "space-y-4"
                    }>
                    {filteredTasks.map((task) => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onEdit={handleEditTask}
                            onDelete={handleDeleteTask}
                            onToggleComplete={handleToggleComplete}
                        />
                    ))}
                </div>
            )}

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                task={selectedTask}
                onSave={handleSaveTask}
            />
        </Layout>
    );
};

export default AllTasks;
