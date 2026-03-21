const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} = require('../controllers/taskController');
const auth = require('../middleware/auth');
const protect = auth.protect;

// All routes are protected
router.use((req,res,next)=>{ const auth = require('../middleware/auth'); return auth.protect(req,res,next); });

router.route('/').get(getTasks).post(createTask);

router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

router.patch('/:id/toggle', toggleTaskStatus);

module.exports = router;


