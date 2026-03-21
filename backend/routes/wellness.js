const express = require('express');
const router = express.Router();
const {
  createWellnessLog,
  getWellnessLogs,
  getCurrentStress,
  getLatestMood,
} = require('../controllers/wellnessController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getWellnessLogs).post(createWellnessLog);

router.get('/stress', getCurrentStress);
router.get('/mood', getLatestMood);

module.exports = router;