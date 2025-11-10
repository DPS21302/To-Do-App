import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import api from '../utils/api';

const Archive = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  const fetchCompletedTasks = async () => {
    try {
      const { data } = await api.get('/tasks/completed');
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch completed tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTask = async (formData, taskId) => {
    try {
      await api.put(`/tasks/${taskId}`, formData);
      fetchCompletedTasks();
    } catch (error) {
      console.error('Failed to save task:', error);
      // Re-throw error so TaskModal can handle it
      throw error;
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        fetchCompletedTasks();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await api.put(`/tasks/${task._id}`, { status: 'pending' });
      fetchCompletedTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center text-2xl font-semibold text-gray-600">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Completed Tasks</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">All your completed tasks</p>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg shadow-sm">
          <p className="text-xl font-semibold text-gray-700">No completed tasks yet</p>
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

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask}
        onSave={handleSaveTask}
      />
    </Layout>
  );
};

export default Archive;
