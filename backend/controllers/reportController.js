const Task = require('../models/Task');
const WellnessLog = require('../models/WellnessLog');
const {
  calculateStressLevel,
  calculateWellnessScore,
} = require('../utils/wellnessCalculations');

const getReports = async (req, res) => {
  try {
    const userId = req.user._id;
    const allTasks = await Task.find({ user: userId });
    const completedTasks = allTasks.filter((task) => task.status === 'completed');
    const pendingTasks = allTasks.filter((task) => task.status === 'pending');

    const completionRate =
      allTasks.length > 0
        ? Math.round((completedTasks.length / allTasks.length) * 100)
        : 0;

    const highPriorityTasks = allTasks.filter((task) => task.priority === 'high').length;
    const mediumPriorityTasks = allTasks.filter((task) => task.priority === 'medium').length;
    const lowPriorityTasks = allTasks.filter((task) => task.priority === 'low').length;

    const latestMoodLog = await WellnessLog.findOne({ user: userId })
      .sort({ date: -1 })
      .limit(1);
    const currentMood = latestMoodLog ? latestMoodLog.mood : 'neutral';

    const stressData = calculateStressLevel(allTasks);
    const wellnessScore = calculateWellnessScore(allTasks, currentMood, completedTasks.length);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyTasks = allTasks.filter(
      (task) => new Date(task.createdAt) >= sevenDaysAgo
    );
    const weeklyCompleted = weeklyTasks.filter(
      (task) => task.status === 'completed'
    ).length;

    const dailyBreakdown = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayTasks = allTasks.filter((task) => {
        const taskDate = new Date(task.createdAt);
        return taskDate >= date && taskDate < nextDate;
      });

      const dayCompleted = dayTasks.filter(
        (task) => task.status === 'completed'
      ).length;

      dailyBreakdown.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        total: dayTasks.length,
        completed: dayCompleted,
        status: dayCompleted === dayTasks.length && dayTasks.length > 0 ? 'completed' : 'pending',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalTasks: allTasks.length,
          completedTasks: completedTasks.length,
          pendingTasks: pendingTasks.length,
          completionRate,
        },
        priority: {
          high: highPriorityTasks,
          medium: mediumPriorityTasks,
          low: lowPriorityTasks,
        },
        stress: stressData,
        wellness: wellnessScore,
        weekly: {
          totalTasks: weeklyTasks.length,
          completed: weeklyCompleted,
          dailyBreakdown,
        },
      },
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

const getTaskStatistics = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });

    const stats = {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === 'completed').length,
      pending: tasks.filter((t) => t.status === 'pending').length,
      byPriority: {
        high: tasks.filter((t) => t.priority === 'high').length,
        medium: tasks.filter((t) => t.priority === 'medium').length,
        low: tasks.filter((t) => t.priority === 'low').length,
      },
      byStatus: {
        completed: tasks.filter((t) => t.status === 'completed').length,
        pending: tasks.filter((t) => t.status === 'pending').length,
      },
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get task statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = {
  getReports,
  getTaskStatistics,
};