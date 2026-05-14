const API_BASE_URL = '/api';

class RewardService {
  /**
   * Fetches the static reward payload for a given action.
   */
  static async calculateReward(actionType) {
    try {
      const response = await fetch(`${API_BASE_URL}/rewards/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ actionType }),
      });

      if (!response.ok) {
        throw new Error('Failed to calculate reward');
      }

      const data = await response.json();
      return data.reward;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * Evaluates if the user unlocked any new achievements/badges.
   */
  static async evaluateAchievements(currentStats, currentInventory) {
    try {
      const response = await fetch(`${API_BASE_URL}/rewards/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentStats, currentInventory }),
      });

      if (!response.ok) {
        throw new Error('Failed to evaluate achievements');
      }

      const data = await response.json();
      return data.newBadges;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}

export default RewardService;
