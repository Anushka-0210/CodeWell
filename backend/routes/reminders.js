const express = require('express');
const router = express.Router();
const {
  scheduleTask,
  cancelTask,
  updateTask,
  completeTask,
  listScheduled,
} = require('../services/schedulerService');

function validateTask(body) {
  const errors = [];
  if (!body.id) errors.push('id is required');
  if (!body.title || body.title.trim() === '') errors.push('title is required');
  if (!body.deadline) errors.push('deadline is required');
  if (isNaN(new Date(body.deadline).getTime())) errors.push('deadline must be a valid date');
  if (!body.priority || !['Low', 'Medium', 'High'].includes(body.priority))
    errors.push('priority must be Low, Medium, or High');
  if (!body.userEmail || !/\S+@\S+\.\S+/.test(body.userEmail))
    errors.push('a valid userEmail is required');
  return errors;
}

router.post('/schedule', (req, res) => {
  const errors = validateTask(req.body);
  if (errors.length) return res.status(400).json({ success: false, errors });

  const { id, title, priority, deadline, description, userEmail } = req.body;
  const task = { id, title, priority, deadline, description: description || '' };

  const info = scheduleTask(task, userEmail);

  res.json({
    success: true,
    message: `Reminders scheduled for "${title}"`,
    info: {
      reminder24h: info.reminder24h,
      highPriorityRepeats: info.highPriorityRepeats,
      repeatInterval: info.repeatInterval,
    },
  });
});

router.put('/update', (req, res) => {
  const errors = validateTask(req.body);
  if (errors.length) return res.status(400).json({ success: false, errors });

  const { id, title, priority, deadline, description, userEmail } = req.body;
  const task = { id, title, priority, deadline, description: description || '' };

  updateTask(task, userEmail);

  res.json({ success: true, message: `Reminders updated for "${title}"` });
});

router.delete('/cancel/:taskId', (req, res) => {
  cancelTask(req.params.taskId);
  res.json({ success: true, message: `Reminders cancelled for task ${req.params.taskId}` });
});

router.patch('/complete/:taskId', (req, res) => {
  completeTask(req.params.taskId);
  res.json({ success: true, message: `Reminders stopped for completed task ${req.params.taskId}` });
});

router.get('/list', (req, res) => {
  res.json({ success: true, scheduled: listScheduled() });
});

module.exports = router;
