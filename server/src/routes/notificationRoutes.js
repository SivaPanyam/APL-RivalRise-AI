const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/trigger-smart-alert', notificationController.triggerSmartAlert);

module.exports = router;
