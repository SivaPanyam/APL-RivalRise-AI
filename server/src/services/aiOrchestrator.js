const { aiClient } = require('../config/ai');

class AIOrchestrator {
  /**
   * General purpose method to interact with Gemini
   * @param {string} prompt - The prompt to send
   * @param {Object} options - Configuration for the generation
   */
  static async generateResponse(prompt, options = {}) {
    if (!aiClient) {
      throw new Error('AI Client not initialized');
    }

    try {
      const model = aiClient.getGenerativeModel({ 
        model: options.model || "gemini-1.5-flash",
        generationConfig: {
          temperature: options.temperature || 0.7,
          topP: options.topP || 0.8,
          topK: options.topK || 40,
          maxOutputTokens: options.maxTokens || 1024,
          responseMimeType: options.json ? "application/json" : "text/plain",
        }
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (options.json) {
        try {
          return JSON.parse(text);
        } catch (e) {
          console.error("Failed to parse AI JSON response", text);
          throw new Error("Invalid AI Response Format");
        }
      }

      return text;
    } catch (error) {
      console.error("AI Orchestration Error:", error);
      throw error;
    }
  }

  /**
   * Specialized method for Identity Generation
   */
  static async analyzeIdentity(userData, predictionHistory) {
    const prompt = `
      Analyze this user's esports engagement and generate a Fan Identity Archetype.
      User Data: ${JSON.stringify(userData)}
      Prediction History: ${JSON.stringify(predictionHistory)}

      Return a JSON object with:
      - archetype: (e.g., Tactical Analyst, Loyal Supporter, Clutch Predictor, Social Leader, Debate Champion)
      - tacticalScore: (0-100)
      - narrative: (A 1-2 sentence personality summary)
      - badges: (Array of 2-3 suggested badge IDs)
    `;

    return await this.generateResponse(prompt, { json: true });
  }

  /**
   * Specialized method for Smart Notifications
   */
  static async generateSmartNotification(userContext, eventType) {
    const prompt = `
      Generate a short, high-energy esports push notification for the following event.
      Event: ${eventType}
      User Context: ${JSON.stringify(userContext)}
      
      Requirements:
      - Max 120 characters.
      - Tone: Competitive, futuristic, motivating.
      - Include the user's name if provided.

      Return a JSON object with:
      - title: (Short catchy title)
      - body: (The personalized message)
    `;

    return await this.generateResponse(prompt, { json: true });
  }

  /**
   * Specialized method for Adaptive Missions
   */
  static async generateAdaptiveMission(userContext) {
    const prompt = `
      Create a personalized daily esports mission for a user.
      User Profile: ${JSON.stringify(userContext)}
      
      Return a JSON object with:
      - title: (Short exciting mission title)
      - objective: (1 sentence goal, e.g., "Make 3 correct predictions in the Cyber Cup")
      - rewardXp: (Number, 100-500)
      - rewardCoins: (Number, 20-100)
      - difficulty: (Easy, Medium, Hard)
    `;

    return await this.generateResponse(prompt, { json: true });
  }
}

module.exports = AIOrchestrator;
