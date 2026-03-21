const express = require('express');
const router = express.Router();
const { getReports, getTaskStatistics } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getReports);
router.get('/tasks', getTaskStatistics);

module.exports = router;