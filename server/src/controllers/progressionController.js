const ProgressionService = require('../services/progressionService');

const progressionController = {
  calculateXpUpdate: async (req, res, next) => {
    try {
      const { userId, activityType, currentData } = req.body;
      if (!userId || !activityType) throw new Error('Missing parameters');

      const update = await ProgressionService.processActivity(userId, activityType, currentData);
      
      res.json({
        success: true,
        data: update
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = progressionController;
