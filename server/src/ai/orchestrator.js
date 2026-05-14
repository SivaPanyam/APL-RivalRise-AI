const { aiClient } = require('../config/ai');
const { EngagementScorer } = require('./engagementScorer');
const { PromptTemplates } = require('./promptTemplates');

class AIOrchestrator {
    
    /**
     * Generates an adaptive, personalized mission based on raw user statistics.
     * 
     * @param {Object} userContext - The raw user data from Firestore (streak, level, xp, etc.)
     * @returns {Object} JSON payload representing the mission
     */
    async generateAdaptiveMission(userContext) {
        if (!aiClient) {
            console.warn("AI Client not configured. Returning fallback mission.");
            return this._getFallbackMission(userContext);
        }

        try {
            // 1. Analyze user to determine engagement tier
            const engagementData = EngagementScorer.calculateTier(userContext);
            console.log(`[AI Orchestrator] User classified as ${engagementData.tier} (Score: ${engagementData.score})`);

            // 2. Generate appropriate prompt
            const prompt = PromptTemplates.getMissionGenerationPrompt(userContext, engagementData);

            // 3. Call Gemini API
            const response = await aiClient.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    temperature: 0.7 // Slightly creative but structured
                }
            });

            // 4. Parse and return JSON
            const rawText = response.text.trim();
            // In case Gemini returns markdown block despite instructions
            const jsonText = rawText.replace(/^```json/i, '').replace(/```$/i, '').trim();
            
            const missionData = JSON.parse(jsonText);
            
            // Inject the engagement tier for analytics later
            missionData.targetTier = engagementData.tier;

            return missionData;

        } catch (error) {
            console.error("[AI Orchestrator] Error generating mission:", error);
            return this._getFallbackMission(userContext);
        }
    }

    /**
     * Fallback mechanism if Gemini API fails or is unconfigured.
     */
    _getFallbackMission(userContext) {
        return {
            title: "Daily Login Standard",
            description: "Log in today and view the leaderboard to earn baseline XP.",
            xpReward: 50,
            difficulty: "Easy",
            category: "Activity",
            aiMessage: "The servers are warming up. Take an easy win today, champion.",
            targetTier: "Fallback"
        };
    }
}

module.exports = new AIOrchestrator();
