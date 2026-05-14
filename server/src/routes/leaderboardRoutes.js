const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');

router.get('/global', leaderboardController.getGlobalRankings);

module.exports = router;
