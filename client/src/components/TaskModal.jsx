import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import * as yup from 'yup';

const taskSchema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),
  description: yup
    .string()
    .max(1000, 'Description must not exceed 1000 characters'),
  dueDate: yup
    .date()
    .required('Due date is required')
    .min(new Date(new Date().setHours(0, 0, 0, 0)), 'Due date cannot be in the past')
    .typeError('Please enter a valid date'),
  category: yup
    .string()
    .required('Category is required')
    .oneOf(['Home', 'Personal', 'Office', 'Other'], 'Invalid category'),
  priority: yup
    .string()
    .required('Priority is required')
    .oneOf(['low', 'medium', 'high'], 'Invalid priority'),
  status: yup
    .string()
    .required('Status is required')
    .oneOf(['pending', 'in-progress', 'completed'], 'Invalid status')
});

const TaskModal = ({ isOpen, onClose, task, onSave }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    category: 'Personal',
    priority: 'medium',
    status: 'pending',
    assignedTo: ''
  });
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        dueDate: new Date(task.dueDate).toISOString().split('T')[0],
        category: task.category,
        priority: task.priority,
        status: task.status,
        assignedTo: task.assignedTo?._id || task.assignedTo || ''
      });
    }
  }, [task]);

  useEffect(() => {
    if (user?.role === 'admin' && isOpen) {
      fetchUsers();
    }
  }, [user, isOpen]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      // Validate form data
      await taskSchema.validate(formData, { abortEarly: false });

      // Clean form data - remove empty strings for optional fields
      const cleanedData = { ...formData };
      if (!cleanedData.assignedTo || cleanedData.assignedTo === '') {
        delete cleanedData.assignedTo;
      }
      if (!cleanedData.description || cleanedData.description === '') {
        delete cleanedData.description;
      }

      // If validation passes, save the task
      await onSave(cleanedData, task?._id);
      handleClose();
    } catch (err) {
      if (err.name === 'ValidationError') {
        // Frontend Yup validation errors
        const validationErrors = {};
        err.inner.forEach(error => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else if (err.response?.data?.errors) {
        // Backend API validation errors
        setErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        // Generic API error message
        setErrors({ general: err.response.data.message });
      } else {
        console.error('Error saving task:', err);
        setErrors({ general: 'Failed to save task. Please try again.' });
      }
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      category: 'Personal',
      priority: 'medium',
      status: 'pending',
      assignedTo: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-lg shadow-2xl p-4 sm:p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4 sm:mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{task ? 'Edit Task' : 'New Task'}</h2>
              <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded transition">
                <X size={20} className="text-gray-600 sm:w-6 sm:h-6" />
              </button>
            </div>

            {errors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle size={18} className="text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-red-700 text-sm">{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-700">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.title
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                  }`}
                />
                {errors.title && (
                  <div className="flex items-center mt-1 text-red-600 text-sm">
                    <AlertCircle size={14} className="mr-1" />
                    <span>{errors.title}</span>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.description
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                  }`}
                />
                {errors.description && (
                  <div className="flex items-center mt-1 text-red-600 text-sm">
                    <AlertCircle size={14} className="mr-1" />
                    <span>{errors.description}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block mb-2 font-semibold text-gray-700">Due Date *</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                      errors.dueDate
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                    }`}
                  />
                  {errors.dueDate && (
                    <div className="flex items-center mt-1 text-red-600 text-sm">
                      <AlertCircle size={14} className="mr-1" />
                      <span>{errors.dueDate}</span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-semibold text-gray-700">Category *</label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 transition appearance-none bg-white cursor-pointer shadow-sm ${
                        errors.category
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
                      <option value="Home" className="py-3 px-4 hover:bg-blue-50">Home</option>
                      <option value="Personal" className="py-3 px-4 hover:bg-blue-50">Personal</option>
                      <option value="Office" className="py-3 px-4 hover:bg-blue-50">Office</option>
                      <option value="Other" className="py-3 px-4 hover:bg-blue-50">Other</option>
                    </select>
                  </div>
                  {errors.category && (
                    <div className="flex items-center mt-1 text-red-600 text-sm">
                      <AlertCircle size={14} className="mr-1" />
                      <span>{errors.category}</span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-semibold text-gray-700">Priority *</label>
                  <div className="relative">
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 transition appearance-none bg-white cursor-pointer shadow-sm ${
                        errors.priority
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
                      <option value="low" className="py-3 px-4 hover:bg-blue-50">Low Priority</option>
                      <option value="medium" className="py-3 px-4 hover:bg-blue-50">Medium Priority</option>
                      <option value="high" className="py-3 px-4 hover:bg-blue-50">High Priority</option>
                    </select>
                  </div>
                  {errors.priority && (
                    <div className="flex items-center mt-1 text-red-600 text-sm">
                      <AlertCircle size={14} className="mr-1" />
                      <span>{errors.priority}</span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-2 font-semibold text-gray-700">Status *</label>
                  <div className="relative">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 transition appearance-none bg-white cursor-pointer shadow-sm ${
                        errors.status
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
                      <option value="pending" className="py-3 px-4 hover:bg-blue-50">Pending</option>
                      <option value="in-progress" className="py-3 px-4 hover:bg-blue-50">In Progress</option>
                      <option value="completed" className="py-3 px-4 hover:bg-blue-50">Completed</option>
                    </select>
                  </div>
                  {errors.status && (
                    <div className="flex items-center mt-1 text-red-600 text-sm">
                      <AlertCircle size={14} className="mr-1" />
                      <span>{errors.status}</span>
                    </div>
                  )}
                </div>

                {user?.role === 'admin' && (
                  <div className="mb-4 md:col-span-2">
                    <label className="block mb-2 font-semibold text-gray-700">Assign To</label>
                    <div className="relative">
                      <select
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleChange}
                        className="w-full px-3 py-2 pr-10 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-white cursor-pointer shadow-sm hover:border-gray-300"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 0.75rem center',
                          backgroundSize: '1.25rem'
                        }}
                      >
                        <option value="" className="py-3 px-4">Select User</option>
                        {users.map((u) => (
                          <option key={u._id} value={u._id} className="py-3 px-4 hover:bg-blue-50">
                            {u.name} ({u.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150"
                >
                  {task ? 'Update' : 'Create'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-2 border border-gray-300 font-semibold rounded-lg hover:bg-gray-50 transition duration-150"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;
