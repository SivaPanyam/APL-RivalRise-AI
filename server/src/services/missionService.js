const AIOrchestrator = require('./aiOrchestrator');

class MissionService {
  /**
   * Generates a highly personalized, adaptive mission by passing
   * user context through the AI Orchestrator.
   * 
   * @param {string} userId - The ID of the user
   * @param {Object} userStats - The user's stats (streak, xp, level, etc.)
   * @param {string} sportPreference - The user's favorite sport
   * @returns {Object} JSON payload of the generated mission
   */
  async generatePersonalizedMission(userId, userStats, sportPreference) {
    
    // Construct the full context object
    const userContext = {
      userId,
      ...userStats,
      sportPreference
    };

    // Pass the context to the intelligent orchestrator
    const mission = await AIOrchestrator.generateAdaptiveMission(userContext);

    return mission;
  }
}

module.exports = new MissionService();
