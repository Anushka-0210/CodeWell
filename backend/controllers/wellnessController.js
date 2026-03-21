const WellnessLog = require('../models/WellnessLog');
const Task = require('../models/Task');
const { calculateStressLevel } = require('../utils/wellnessCalculations');

const createWellnessLog = async (req, res) => {
  try {
    const { mood, stressLevel, notes } = req.body;

    if (!mood || !stressLevel) {
      return res.status(400).json({
        success: false,
        message: 'Please provide mood and stress level',
      });
    }

    const wellnessLog = await WellnessLog.create({
      user: req.user._id,
      mood,
      stressLevel,
      notes,
    });

    res.status(201).json({
      success: true,
      data: wellnessLog,
      message: 'Wellness log created successfully',
    });
  } catch (error) {
    console.error('Create wellness log error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

const getWellnessLogs = async (req, res) => {
  try {
    const { startDate, endDate, limit } = req.query;

    let query = { user: req.user._id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const logs = await WellnessLog.find(query)
      .sort({ date: -1 })
      .limit(limit ? parseInt(limit) : 100);

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    console.error('Get wellness logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

const getCurrentStress = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    const stressData = calculateStressLevel(tasks);

    res.status(200).json({
      success: true,
      data: stressData,
    });
  } catch (error) {
    console.error('Get stress level error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

const getLatestMood = async (req, res) => {
  try {
    const latestLog = await WellnessLog.findOne({ user: req.user._id })
      .sort({ date: -1 })
      .limit(1);

    res.status(200).json({
      success: true,
      data: latestLog ? { mood: latestLog.mood, date: latestLog.date } : null,
    });
  } catch (error) {
    console.error('Get latest mood error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = {
  createWellnessLog,
  getWellnessLogs,
  getCurrentStress,
  getLatestMood,
};