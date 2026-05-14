const MissionService = require('../services/missionService');

const missionController = {
  getAdaptiveMissions: async (req, res, next) => {
    try {
      const { userId, userStats, sportPreference } = req.body;
      if (!userId) throw new Error('User ID required');

      const mission = await MissionService.generatePersonalizedMission(userId, userStats, sportPreference);
      
      res.json({
        success: true,
        data: mission
      });
    } catch (error) {
      next(error);
    }
  },

  completeMission: async (req, res, next) => {
    try {
      const { missionId, userId } = req.body;
      // Logic to verify completion and award rewards
      res.json({
        success: true,
        message: 'Mission completed',
        rewards: { xp: 200, coins: 50 }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = missionController;
