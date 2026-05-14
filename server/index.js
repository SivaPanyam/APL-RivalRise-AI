const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const logger = require('./src/middleware/logger');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Logger
logger(app);

app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../client/dist')));

// Serve runtime config for frontend
app.get('/env-config.js', (req, res) => {
  const config = {
    VITE_FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID: process.env.VITE_FIREBASE_APP_ID,
    VITE_FIREBASE_MEASUREMENT_ID: process.env.VITE_FIREBASE_MEASUREMENT_ID,
  };
  res.type('application/javascript');
  res.send(`window.APP_CONFIG = ${JSON.stringify(config)};`);
});

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'RivalRise AI Backend Running' });
});

// Modular Routes
const userRoutes = require('./src/routes/userRoutes');
const missionRoutes = require('./src/routes/missionRoutes');
const progressionRoutes = require('./src/routes/progressionRoutes');
const rewardRoutes = require('./src/routes/rewardRoutes');
const tournamentRoutes = require('./src/routes/tournamentRoutes');
const leaderboardRoutes = require('./src/routes/leaderboardRoutes');
const aiRoutes = require('./src/routes/aiRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');

app.use('/api/users', userRoutes);
app.use('/api/missions', missionRoutes);
app.use('/api/progression', progressionRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);

// Catch-all to serve React app for any non-API routes
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Global Error Handler (Must be last)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
