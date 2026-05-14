/**
 * Analyzes raw user statistics to calculate an Engagement Score and Tier.
 * 
 * Tiers:
 * - Casual: 0 - 30 score
 * - Active: 31 - 70 score
 * - Hardcore: 71+ score
 */

const TIERS = {
    CASUAL: 'Casual',
    ACTIVE: 'Active',
    HARDCORE: 'Hardcore'
};

class EngagementScorer {
    
    /**
     * Calculates the engagement score based on user activity metrics.
     * @param {Object} userStats 
     * @returns {Object} { score, tier, recommendations }
     */
    static calculateTier(userStats) {
        let score = 0;
        
        const streak = userStats?.streak || 0;
        const level = userStats?.level || 1;
        const xp = userStats?.xp || 0;
        const predictionsMade = userStats?.predictionsMade || 0;
        
        // Scoring Algorithm
        // 1. Streak weight (High retention indicator)
        score += Math.min(streak * 2, 40); // Max 40 points from streaks
        
        // 2. Level weight
        score += Math.min(level * 1.5, 30); // Max 30 points from level
        
        // 3. Activity weight
        score += Math.min(predictionsMade * 0.5, 30); // Max 30 points from actions
        
        score = Math.floor(score);

        // Determine Tier
        let tier = TIERS.CASUAL;
        if (score > 30 && score <= 70) {
            tier = TIERS.ACTIVE;
        } else if (score > 70) {
            tier = TIERS.HARDCORE;
        }

        // Generate behavioral insights based on missing metrics
        const behavioralInsights = [];
        if (streak === 0) {
            behavioralInsights.push("User has lost their streak. Needs an easy win mission to rebuild habit.");
        } else if (streak > 7) {
            behavioralInsights.push("User is on a hot streak. Give them a challenging high-reward mission.");
        }

        if (predictionsMade === 0) {
            behavioralInsights.push("User hasn't made any predictions. Introduce a simple prediction mission.");
        }

        return {
            score,
            tier,
            behavioralInsights
        };
    }
}

module.exports = { EngagementScorer, TIERS };
