const express = require('express');
const router = express.Router();
const missionController = require('../controllers/missionController');

router.post('/adaptive', missionController.getAdaptiveMissions);
router.post('/complete', missionController.completeMission);

module.exports = router;
