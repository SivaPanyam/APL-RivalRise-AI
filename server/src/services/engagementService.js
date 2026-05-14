/**
 * Scoring engine for user engagement
 */
class EngagementService {
  /**
   * Calculates a composite engagement score (0-1000)
   */
  static calculateScore(userData, activityHistory) {
    const streakBonus = (userData.streak || 0) * 10;
    const activityCount = activityHistory?.length || 0;
    const activityWeight = 5;
    
    // Logic to weight different actions
    const rawScore = streakBonus + (activityCount * activityWeight);
    
    // Normalize to 0-1000 range
    return Math.min(1000, rawScore);
  }

  /**
   * Identifies user's peak activity hours for smart notification timing
   */
  static getOptimalEngagementTime(activityHistory) {
    if (!activityHistory || activityHistory.length === 0) return '18:00'; // Default to evening
    
    // Simple logic to find the most frequent hour in history
    const hours = activityHistory.map(a => {
      const date = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
      return date.getHours();
    });

    const counts = {};
    hours.forEach(h => counts[h] = (counts[h] || 0) + 1);
    
    const peakHour = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    return `${peakHour.padStart(2, '0')}:00`;
  }
}

module.exports = EngagementService;
