import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2 } from "lucide-react";
import {
    DndContext,
    DragOverlay,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Layout from "../components/Layout";
import TaskModal from "../components/TaskModal";
import api from "../utils/api";

// Task Card Component with drag functionality
const TaskCard = ({ task, onEdit, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task._id,
        data: {
            type: "task",
            task: task,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white border border-gray-200 rounded-lg p-2 sm:p-3 hover:shadow-md transition touch-none">
            <div className="flex justify-between items-start mb-1 sm:mb-2">
                <h3
                    {...attributes}
                    {...listeners}
                    className="font-bold text-sm sm:text-base text-gray-800 flex-1 line-clamp-2 cursor-grab active:cursor-grabbing">
                    {task.title}
                </h3>
                <div className="flex gap-1 ml-2 flex-shrink-0">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onEdit(task);
                        }}
                        className="p-1 hover:bg-blue-100 rounded transition"
                        title="Edit task">
                        <Edit2
                            size={12}
                            className="text-blue-600 sm:w-3.5 sm:h-3.5"
                        />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDelete(task._id);
                        }}
                        className="p-1 hover:bg-red-100 rounded transition"
                        title="Delete task">
                        <Trash2
                            size={12}
                            className="text-red-600 sm:w-3.5 sm:h-3.5"
                        />
                    </button>
                </div>
            </div>

            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing">
                {task.description && (
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 line-clamp-2">
                        {task.description}
                    </p>
                )}

                <div className="flex flex-wrap gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-300 rounded-full">
                        {task.category}
                    </span>
                    <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-300 rounded-full">
                        {task.priority.toUpperCase()}
                    </span>
                </div>

                <div className="text-xs text-gray-500">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

// Droppable Column Component
const DroppableColumn = ({ column, tasks, onEdit, onDelete }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
        data: {
            type: "column",
            status: column.id,
        },
    });

    return (
        <div
            ref={setNodeRef}
            className={`border-2 ${
                column.color
            } rounded-lg p-3 sm:p-4 transition-all ${
                isOver ? "ring-2 ring-blue-500 bg-blue-50" : ""
            }`}>
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center justify-between text-gray-800">
                <span className="truncate">{column.title}</span>
                <span className="text-xs sm:text-sm font-normal bg-white px-2 py-1 rounded-full border border-gray-300 ml-2">
                    {tasks.length}
                </span>
            </h2>
            <SortableContext
                id={column.id}
                items={tasks.map((t) => t._id)}
                strategy={verticalListSortingStrategy}>
                <div className="space-y-2 sm:space-y-3 min-h-[300px] sm:min-h-[500px]">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                    {/* Empty droppable area to help with detection */}
                    {tasks.length === 0 && (
                        <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                            Drop tasks here
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
};

const KanbanBoard = () => {
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState(null);
    const [draggedTaskOriginalStatus, setDraggedTaskOriginalStatus] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const columns = [
        {
            id: "pending",
            title: "Pending",
            color: "bg-gray-50 border-gray-300",
        },
        {
            id: "in-progress",
            title: "In Progress",
            color: "bg-blue-50 border-blue-300",
        },
        {
            id: "completed",
            title: "Completed",
            color: "bg-green-50 border-green-300",
        },
    ];

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const { data } = await api.get("/tasks");
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

    const handleEditTask = (task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleDragStart = (event) => {
        const activeTask = tasks.find((t) => t._id === event.active.id);
        // Store the original status when drag starts
        if (activeTask) {
            setDraggedTaskOriginalStatus(activeTask.status);
        }
        setActiveId(event.active.id);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeTask = tasks.find((t) => t._id === active.id);
        if (!activeTask) return;

        // Check if dropped over a column
        const overColumn = columns.find((col) => col.id === over.id);
        if (overColumn && activeTask.status !== overColumn.id) {
            // Update task status immediately for smooth UX
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === active.id
                        ? { ...task, status: overColumn.id }
                        : task
                )
            );
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        const originalStatus = draggedTaskOriginalStatus;

        // Reset the stored status
        setActiveId(null);
        setDraggedTaskOriginalStatus(null);

        if (!over) return;
        if (!originalStatus) return;

        // Determine the target column from the data
        let targetStatus = null;

        // Check if over data has type information
        if (over.data.current?.type === "column") {
            // Dropped directly over a column
            targetStatus = over.data.current.status;
        } else if (over.data.current?.sortable?.containerId) {
            // Dropped over a task - get the container ID which is the column status
            targetStatus = over.data.current.sortable.containerId;
        } else if (over.data.current?.type === "task") {
            // Fallback: if task has the status from our data
            const overTask = tasks.find((t) => t._id === over.id);
            if (overTask) {
                targetStatus = overTask.status;
            }
        } else {
            // Final fallback: try to find column by ID
            const overColumn = columns.find((col) => col.id === over.id);
            if (overColumn) {
                targetStatus = overColumn.id;
            }
        }

        // Only update if status changed from the ORIGINAL status
        if (targetStatus && originalStatus !== targetStatus) {
            // Optimistically update UI
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === active.id
                        ? { ...task, status: targetStatus }
                        : task
                )
            );

            try {
                await api.put(`/tasks/${active.id}`, {
                    status: targetStatus,
                });
                // Fetch fresh data from server to ensure consistency
                await fetchTasks();
            } catch (error) {
                console.error("Failed to update task status:", error);
                // Revert on error
                await fetchTasks();
            }
        }
    };

    const getTasksByStatus = (status) => {
        return tasks.filter((task) => task.status === status);
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
                    Kanban Board
                </h1>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        setSelectedTask(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 w-full sm:w-auto justify-center">
                    <Plus size={20} />
                    <span>New Task</span>
                </motion.button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                    {columns.map((column) => (
                        <DroppableColumn
                            key={column.id}
                            column={column}
                            tasks={getTasksByStatus(column.id)}
                            onEdit={handleEditTask}
                            onDelete={handleDeleteTask}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeId ? (
                        <div className="bg-white border-2 border-blue-500 rounded-lg p-3 shadow-xl opacity-90">
                            <h3 className="font-bold text-gray-800">
                                {tasks.find((t) => t._id === activeId)?.title}
                            </h3>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => {
                    setSelectedTask(null);
                    setIsModalOpen(false);
                }}
                task={selectedTask}
                onSave={handleSaveTask}
            />
        </Layout>
    );
};

export default KanbanBoard;
