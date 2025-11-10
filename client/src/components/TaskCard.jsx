import { motion } from "framer-motion";
import { Trash2, Edit, Check, Clock, User, UserCircle } from "lucide-react";

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
    const dueDate = new Date(task.dueDate).toLocaleDateString();

    const priorityColors = {
        low: "border-gray-300",
        medium: "border-blue-400",
        high: "border-blue-600",
    };

    const statusColors = {
        pending: "bg-white",
        "in-progress": "bg-blue-50",
        completed: "bg-gray-100",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className={`border-2 ${priorityColors[task.priority]} ${
                statusColors[task.status]
            } p-4 rounded-lg shadow-sm hover:shadow-md transition`}>
            <div className="flex justify-between items-start mb-2">
                <h3
                    className={`text-lg font-bold text-gray-800 ${
                        task.status === "completed"
                            ? "line-through text-gray-500"
                            : ""
                    }`}>
                    {task.title}
                </h3>
                <div className="flex space-x-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onToggleComplete(task)}
                        className="p-1 hover:bg-green-100 rounded transition"
                        title="Toggle complete">
                        <Check size={18} className="text-green-600" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onEdit(task)}
                        className="p-1 hover:bg-blue-100 rounded transition"
                        title="Edit task">
                        <Edit size={18} className="text-blue-600" />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(task._id)}
                        className="p-1 hover:bg-red-100 rounded transition"
                        title="Delete task">
                        <Trash2 size={18} className="text-red-600" />
                    </motion.button>
                </div>
            </div>

            {task.description && (
                <p className="text-sm mb-3 text-gray-600">{task.description}</p>
            )}

            <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 text-xs font-semibold border border-blue-300 bg-blue-50 text-blue-700 rounded-full">
                    {task.category}
                </span>
                <span className="px-3 py-1 text-xs font-semibold border border-gray-300 bg-gray-50 text-gray-700 rounded-full">
                    {task.priority.toUpperCase()}
                </span>
                <span className="px-3 py-1 text-xs font-semibold border border-gray-300 bg-gray-50 text-gray-700 rounded-full">
                    {task.status}
                </span>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                    <Clock size={16} className="mr-1" />
                    Due: {dueDate}
                </div>

                <div className="flex items-center justify-between gap-2">
                    {task.createdBy && (
                        <div className="flex items-center text-gray-600">
                            <UserCircle size={16} className="mr-1 text-gray-500" />
                            <span className="text-xs">
                                Created by: <span className="font-semibold text-gray-700">{task.createdBy.name}</span>
                            </span>
                        </div>
                    )}

                    {task.assignedTo && (
                        <div className="flex items-center text-gray-600">
                            <User size={16} className="mr-1 text-blue-600" />
                            <span className="text-xs">
                                Assigned: <span className="font-semibold text-blue-700">{task.assignedTo.name}</span>
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default TaskCard;
