const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/profile', userController.getProfile);
router.put('/settings', userController.updateSettings);

module.exports = router;
