import Task from '../models/Task.js';
import User from '../models/User.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const totalUsers = await User.countDocuments();

    // Get start of today (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Last Week: 7 days ago to today (start of today, not including today)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    // Previous Week: 14 days ago to 7 days ago
    const fourteenDaysAgo = new Date(today);
    fourteenDaysAgo.setDate(today.getDate() - 14);

    const tasksLastWeek = await Task.countDocuments({
      createdAt: { $gte: sevenDaysAgo, $lt: today }
    });

    const tasksPreviousWeek = await Task.countDocuments({
      createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo }
    });

    const averageTasksPerUser = totalUsers > 0 ? (tasksLastWeek / totalUsers).toFixed(2) : 0;

    const statusDistribution = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalTasks,
      totalUsers,
      averageTasksPerUser,
      tasksLastWeek,
      tasksPreviousWeek,
      statusDistribution: statusDistribution.map(item => ({
        status: item._id,
        count: item.count
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTasksAdmin = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserTaskStats = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      {
        $group: {
          _id: '$assignedTo',
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          pendingTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          userId: '$_id',
          userName: '$user.name',
          userEmail: '$user.email',
          totalTasks: 1,
          completedTasks: 1,
          pendingTasks: 1
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
