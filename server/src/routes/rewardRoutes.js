const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardController');

router.post('/calculate', rewardController.calculateReward);
router.post('/evaluate', rewardController.evaluateAchievements);

module.exports = router;
