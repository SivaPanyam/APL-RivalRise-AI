const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// POST /api/ai/coach/chat
router.post('/coach/chat', aiController.chatWithCoach);

// POST /api/ai/identity/analyze
router.post('/identity/analyze', aiController.analyzeIdentity);

module.exports = router;
