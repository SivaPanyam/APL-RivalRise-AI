const rewardEngine = require('../utils/rewardEngine');

/**
 * Calculates a reward payout (XP and Coins) but does NOT write to the database.
 * The client will handle writing to Firestore for this prototype to simplify auth rules.
 */
const calculateReward = async (req, res) => {
  try {
    const { actionType } = req.body;
    
    if (!actionType) {
      return res.status(400).json({ error: 'actionType is required' });
    }

    const reward = rewardEngine.calculateReward(actionType);
    
    res.status(200).json({
      success: true,
      reward
    });
  } catch (error) {
    console.error('Error calculating reward:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate reward',
      details: error.message
    });
  }
};

/**
 * Evaluates stats to see if any new badges are unlocked.
 */
const evaluateAchievements = async (req, res) => {
  try {
    const { currentStats, currentInventory } = req.body;

    if (!currentStats) {
      return res.status(400).json({ error: 'currentStats is required' });
    }

    const newBadges = rewardEngine.evaluateAchievements(currentStats, currentInventory || []);

    res.status(200).json({
      success: true,
      newBadges
    });
  } catch (error) {
    console.error('Error evaluating achievements:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to evaluate achievements',
      details: error.message
    });
  }
};

module.exports = {
  calculateReward,
  evaluateAchievements
};
