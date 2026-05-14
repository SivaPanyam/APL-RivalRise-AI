const { aiClient } = require('../config/ai');

class AIOrchestrator {
  /**
   * General purpose method to interact with Gemini via Vertex AI
   * @param {string} prompt - The prompt to send
   * @param {Object} options - Configuration for the generation
   */
  static async generateResponse(prompt, options = {}) {
    if (!aiClient) {
      throw new Error('AI Client not initialized');
    }

    try {
      // For Vertex AI, aiClient is already the model instance
      // We pass the generation configuration to generateContent
      const request = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: options.temperature || 0.7,
          topP: options.topP || 0.8,
          topK: options.topK || 40,
          maxOutputTokens: options.maxTokens || 1024,
          responseMimeType: options.json ? "application/json" : "text/plain",
        }
      };

      const result = await aiClient.generateContent(request);
      const response = await result.response;
      
      // In Vertex AI SDK, candidates[0].content.parts[0].text is the common way
      // but response.text() is often available in newer versions
      const text = response.candidates[0].content.parts[0].text;

      if (options.json) {
        try {
          // Clean up potential markdown code blocks
          const jsonText = text.replace(/^```json/i, '').replace(/```$/i, '').trim();
          return JSON.parse(jsonText);
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
      - description: (1-2 sentence goal, e.g., "Make 3 correct predictions in the Cyber Cup")
      - xpReward: (Number, 100-500)
      - coinReward: (Number, 20-100)
      - difficulty: (Easy, Medium, Hard)
      - target: (Number, usually 3-10 depending on difficulty)
      - progress: 0
      - aiMessage: (A short encouraging message from the AI Coach)
    `;

    return await this.generateResponse(prompt, { json: true });
  }
}

module.exports = AIOrchestrator;
