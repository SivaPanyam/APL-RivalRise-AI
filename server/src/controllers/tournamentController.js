const tournamentController = {
  getBrackets: async (req, res, next) => {
    try {
      // Mock data for brackets
      res.json({
        success: true,
        data: [
          { id: 't1', name: 'Global Masters', round: 'Quarterfinals', matches: [] },
          { id: 't2', name: 'Rivalry Cup', round: 'Semifinals', matches: [] }
        ]
      });
    } catch (error) {
      next(error);
    }
  },

  submitPrediction: async (req, res, next) => {
    try {
      const { matchId, predictedWinner, userId } = req.body;
      res.json({
        success: true,
        message: 'Prediction submitted',
        prediction: { matchId, predictedWinner, userId, timestamp: new Date() }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = tournamentController;
