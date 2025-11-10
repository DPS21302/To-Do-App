import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  getAllTasksAdmin,
  getUserTaskStats
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/tasks', getAllTasksAdmin);
router.get('/user-stats', getUserTaskStats);

export default router;
