const leaderboardController = {
  getGlobalRankings: async (req, res, next) => {
    try {
      // Mock data for leaderboard
      res.json({
        success: true,
        data: [
          { rank: 1, username: 'ClutchGod', xp: 15000, badges: 12 },
          { rank: 2, username: 'TacticalWizard', xp: 14200, badges: 10 },
          { rank: 3, username: 'NeoFan', xp: 13800, badges: 9 },
        ]
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = leaderboardController;
