const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');

router.get('/brackets', tournamentController.getBrackets);
router.post('/predict', tournamentController.submitPrediction);

module.exports = router;
