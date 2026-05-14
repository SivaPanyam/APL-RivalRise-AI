const express = require('express');
const router = express.Router();
const progressionController = require('../controllers/progressionController');

router.post('/calculate-xp', progressionController.calculateXpUpdate);

module.exports = router;
