const { aiClient } = require('../config/ai');

class IdentityEngine {
  async analyzeFan(userData, predictions) {
    const prompt = `
      You are the "AI Identity Assessor" for an esports engagement platform called RivalRise AI.
      Your task is to analyze a fan's data and generate a personalized, evolving "Fan Persona".
      
      USER DATA:
      - Username: ${userData.username || 'Player'}
      - Rank Level: ${userData.level || 1}
      - XP: ${userData.xp || 0}
      - Current Login Streak: ${userData.streak || 0} days
      - Favorite Faction: ${userData.sportPreference || 'Unassigned'}
      - Total Predictions Made: ${predictions?.length || 0}
      
      Generate a JSON response strictly following this schema:
      {
        "archetype": "string (One of: Tactical Analyst, Loyal Supporter, Clutch Predictor, Social Leader, Debate Champion, Rookie Observer)",
        "narrative": "string (A punchy 2-sentence story about their fandom style based on their stats)",
        "tacticalScore": "number (A score from 1-100 evaluating their engagement and prediction activity)"
      }
      
      RULES:
      1. If they have 0 predictions, they are a "Rookie Observer".
      2. If they have a high streak, they are a "Loyal Supporter".
      3. The narrative MUST use their stats (e.g., mentioning their streak or their favorite faction).
      4. DO NOT return markdown formatting like \`\`\`json. Return ONLY raw JSON.
    `;

    try {
      const request = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        }
      };

      const result = await aiClient.generateContent(request);
      const response = await result.response;
      const text = response.candidates[0].content.parts[0].text;
      
      // Clean up potential markdown code blocks
      const jsonText = text.replace(/^```json/i, '').replace(/```$/i, '').trim();
      return JSON.parse(jsonText);
    } catch (error) {
      console.error("[IdentityEngine] Failed to generate identity:", error);
      // Fallback response in case of API failure
      return {
        archetype: "Unknown Entity",
        narrative: "Your data is currently obscured by a tactical jammer. Keep engaging to reveal your true identity.",
        tacticalScore: 50
      };
    }
  }
}

module.exports = new IdentityEngine();
