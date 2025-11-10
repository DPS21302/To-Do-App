import express from 'express';
import {
  createTask,
  getTasks,
  getTodayTasks,
  getCompletedTasks,
  getOverdueTasks,
  getTaskById,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createTaskSchema, updateTaskSchema } from '../validation/taskValidation.js';

const router = express.Router();

router.use(protect);

router.post('/', validate(createTaskSchema), createTask);

router.get('/', getTasks);
router.get('/today', getTodayTasks);
router.get('/completed', getCompletedTasks);
router.get('/overdue', getOverdueTasks);
router.get('/:id', getTaskById);
router.put('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

export default router;
