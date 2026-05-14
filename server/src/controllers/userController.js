const ProgressionService = require('../services/progressionService');
const EngagementService = require('../services/engagementService');

const userController = {
  getProfile: async (req, res, next) => {
    try {
      const { userData } = req.body; // In real app, fetch from DB using UID from auth
      if (!userData) throw new Error('User data required');

      const level = ProgressionService.calculateLevel(userData.xp || 0);
      const rank = ProgressionService.getRank(level);
      const engagementScore = EngagementService.calculateScore(userData, []);

      res.json({
        success: true,
        data: {
          ...userData,
          level,
          rank,
          engagementScore
        }
      });
    } catch (error) {
      next(error);
    }
  },

  updateSettings: async (req, res, next) => {
    try {
      // Mock update
      res.json({ success: true, message: 'Settings updated' });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;
