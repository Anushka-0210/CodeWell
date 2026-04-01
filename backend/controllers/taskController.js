const Task = require('../models/Task');
const {
  scheduleTask,
  cancelTask,
  updateTask: updateScheduledTask,
  completeTask,
} = require('../services/schedulerService');

// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this task',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, priority, deadline } = req.body;

    // Validation
    if (!title || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and deadline',
      });
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      priority: priority || 'medium',
      deadline,
    });

    const schedulePayload = {
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      priority: task.priority,
      deadline: task.deadline,
      status: task.status,
    };

    try {
      await scheduleTask(schedulePayload, req.user.email);
    } catch (scheduleError) {
      console.error('Schedule task error:', scheduleError);
    }

    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully',
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this task',
      });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    const updatePayload = {
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      priority: task.priority,
      deadline: task.deadline,
      status: task.status,
    };

    try {
      await updateScheduledTask(updatePayload, req.user.email);
    } catch (updateError) {
      console.error('Update scheduler error:', updateError);
    }

    res.status(200).json({
      success: true,
      data: task,
      message: 'Task updated successfully',
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this task',
      });
    }

    await task.deleteOne();

    try {
      await cancelTask(req.params.id);
    } catch (cancelError) {
      console.error('Cancel scheduler error:', cancelError);
    }

    res.status(200).json({
      success: true,
      data: {},
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

// @desc    Toggle task status (pending/completed)
// @route   PATCH /api/tasks/:id/toggle
// @access  Private
const toggleTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this task',
      });
    }

    task.status = task.status === 'pending' ? 'completed' : 'pending';
    await task.save();

    try {
      if (task.status === 'completed') {
        await completeTask(task._id.toString());
      } else {
        const restorePayload = {
          id: task._id.toString(),
          title: task.title,
          description: task.description,
          priority: task.priority,
          deadline: task.deadline,
          status: task.status,
        };
        await updateTask(restorePayload, req.user.email);
      }
    } catch (statusError) {
      console.error('Task status scheduler error:', statusError);
    }

    res.status(200).json({
      success: true,
      data: task,
      message: 'Task status updated successfully',
    });
  } catch (error) {
    console.error('Toggle task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
};