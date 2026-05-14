/**
 * Logic for XP, Leveling, and Ranks
 */
class ProgressionService {
  static XP_PER_PREDICTION = 50;
  static XP_PER_MISSION = 200;
  static XP_PER_CHAT = 5;

  /**
   * Calculates the level based on total XP
   * Formula: level = floor(sqrt(xp / 100)) + 1
   */
  static calculateLevel(xp) {
    if (!xp || xp < 0) return 1;
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }

  /**
   * Calculates the XP required for a specific level
   */
  static getXpForLevel(level) {
    if (level <= 1) return 0;
    return Math.pow(level - 1, 2) * 100;
  }

  /**
   * Determines the Rank Name based on level
   */
  static getRank(level) {
    if (level < 5) return 'Recruit';
    if (level < 15) return 'Vanguard';
    if (level < 30) return 'Elite';
    if (level < 50) return 'Champion';
    return 'Legend';
  }

  /**
   * Process an activity and return the XP update
   */
  static async processActivity(userId, activityType, currentData) {
    let xpGain = 0;
    switch (activityType) {
      case 'PREDICTION_MADE': xpGain = this.XP_PER_PREDICTION; break;
      case 'MISSION_COMPLETE': xpGain = this.XP_PER_MISSION; break;
      case 'CHAT_MESSAGE': xpGain = this.XP_PER_CHAT; break;
      default: xpGain = 0;
    }

    const newXp = (currentData.xp || 0) + xpGain;
    const oldLevel = this.calculateLevel(currentData.xp || 0);
    const newLevel = this.calculateLevel(newXp);

    return {
      xpGained: xpGain,
      totalXp: newXp,
      levelUp: newLevel > oldLevel,
      currentLevel: newLevel,
      rank: this.getRank(newLevel)
    };
  }
}

module.exports = ProgressionService;
