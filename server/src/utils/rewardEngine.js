// Static Economy Configuration
const REWARD_TIERS = {
  EASY: { xp: 50, coins: 10 },
  MEDIUM: { xp: 100, coins: 25 },
  HARD: { xp: 250, coins: 50 },
  PREDICTION_WIN: { xp: 150, coins: 40 }
};

const BADGE_ACHIEVEMENTS = [
  {
    id: 'badge_first_blood',
    name: 'First Blood',
    description: 'Complete your first prediction or mission.',
    rarity: 'common',
    condition: (stats) => (stats.predictions >= 1 || stats.missionsCompleted >= 1)
  },
  {
    id: 'badge_streak_3',
    name: 'Momentum',
    description: 'Reach a 3-day login streak.',
    rarity: 'rare',
    condition: (stats) => stats.streak >= 3
  },
  {
    id: 'badge_streak_7',
    name: 'Iron Will',
    description: 'Reach a 7-day login streak.',
    rarity: 'epic',
    condition: (stats) => stats.streak >= 7
  },
  {
    id: 'badge_analyst_10',
    name: 'Tactical Mind',
    description: 'Make 10 predictions.',
    rarity: 'legendary',
    condition: (stats) => stats.predictions >= 10
  }
];

class RewardEngine {
  /**
   * Calculates XP and Coins based on the action difficulty.
   */
  calculateReward(actionType) {
    return REWARD_TIERS[actionType] || REWARD_TIERS.EASY;
  }

  /**
   * Evaluates user stats against available achievements and returns newly unlocked badges.
   * @param {Object} currentStats - e.g., { streak: 5, predictions: 2, missionsCompleted: 1 }
   * @param {Array} currentInventory - Array of currently owned badge objects.
   * @returns {Array} - Array of newly unlocked badge objects.
   */
  evaluateAchievements(currentStats, currentInventory = []) {
    const ownedIds = new Set(currentInventory.map(item => item.id));
    const newBadges = [];

    for (const badge of BADGE_ACHIEVEMENTS) {
      if (!ownedIds.has(badge.id) && badge.condition(currentStats)) {
        newBadges.push({
          id: badge.id,
          name: badge.name,
          description: badge.description,
          rarity: badge.rarity,
          type: 'badge',
          acquiredAt: new Date().toISOString()
        });
      }
    }

    return newBadges;
  }
}

module.exports = new RewardEngine();
