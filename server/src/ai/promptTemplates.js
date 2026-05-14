const { TIERS } = require('./engagementScorer');

class PromptTemplates {
    
    /**
     * Generates a tailored prompt for creating a mission based on user tier.
     * @param {Object} userContext 
     * @param {Object} engagementData 
     * @returns {string} The prompt for Gemini
     */
    static getMissionGenerationPrompt(userContext, engagementData) {
        const { tier, behavioralInsights } = engagementData;
        const sportPreference = userContext.sportPreference || 'Any Sport';
        
        let difficultyDirective = '';
        let tone = '';

        switch (tier) {
            case TIERS.CASUAL:
                difficultyDirective = "Create a very simple, quick-to-complete mission (Easy difficulty). Focus on basic engagement like logging in, viewing a profile, or making 1 simple prediction.";
                tone = "Encouraging, welcoming, and casual.";
                break;
            case TIERS.ACTIVE:
                difficultyDirective = "Create a medium-difficulty mission. Focus on consistent engagement like maintaining streaks, social sharing, or predicting match outcomes.";
                tone = "Competitive but supportive, energetic.";
                break;
            case TIERS.HARDCORE:
                difficultyDirective = "Create a highly tactical, advanced mission (Hard difficulty). Require deep platform knowledge, complex multi-step predictions, or high-tier social challenges.";
                tone = "Intense, challenging, treating the user like a veteran esports athlete.";
                break;
            default:
                difficultyDirective = "Create a standard mission.";
                tone = "Neutral.";
        }

        const insightsStr = behavioralInsights.length > 0 
            ? `\nKey Behavioral Insights to incorporate: \n- ${behavioralInsights.join('\n- ')}` 
            : '';

        return `
        You are the "RivalRise AI Orchestrator", a futuristic, intelligent sports gamification engine.
        Generate exactly ONE personalized daily mission for a user.

        User Context:
        - Sport Preference: ${sportPreference}
        - Current Level: ${userContext.level || 1}
        - Current Streak: ${userContext.streak || 0} days
        - Engagement Tier: ${tier}
        ${insightsStr}

        Directives:
        - Tone: ${tone}
        - Difficulty: ${difficultyDirective}

        The output MUST be valid JSON matching this exact structure:
        {
            "title": "A catchy, esports-style mission title",
            "description": "A clear, actionable description of what the user needs to do.",
            "xpReward": <number, scale based on difficulty, e.g., 50 for easy, 250 for hard>,
            "difficulty": "<Easy | Medium | Hard>",
            "category": "<Prediction | Social | Activity | Streak>",
            "aiMessage": "A short, in-character message from the RivalRise AI Coach giving them a tip or hype for this mission."
        }
        
        Do not output any markdown formatting or code blocks. Output ONLY raw JSON.
        `;
    }
}

module.exports = { PromptTemplates };
