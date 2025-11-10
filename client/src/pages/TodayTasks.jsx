import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Layout from "../components/Layout";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import api from "../utils/api";

const TodayTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const { data } = await api.get("/tasks/today");
            setTasks(data);
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
                    Today's Tasks
                </h1>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 w-full sm:w-auto">
                    <Plus size={20} />
                    <span>New Task</span>
                </motion.button>
            </div>

            <div>
                {tasks.length === 0 ? (
                    <div className="text-center py-12 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <p className="text-xl font-semibold text-gray-700">
                            No tasks due today
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tasks.map((task) => (
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
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                task={selectedTask}
                onSave={handleSaveTask}
            />
        </Layout>
    );
};

export default TodayTasks;
