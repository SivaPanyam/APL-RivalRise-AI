const { getModel, aiClient } = require('../config/ai');
const identityEngine = require('../ai/identityEngine');

const analyzeIdentity = async (req, res) => {
  try {
    const { userData, predictions } = req.body;

    if (!userData) {
      return res.status(400).json({ error: 'userData is required' });
    }

    const identityData = await identityEngine.analyzeFan(userData, predictions);

    res.status(200).json({
      success: true,
      identity: identityData
    });
  } catch (error) {
    console.error('Error analyzing identity:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze fan identity',
      details: error.message
    });
  }
};

const chatWithCoach = async (req, res) => {
  try {
    const { prompt, userContext } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const { username, level, streak, favTeam, rankName } = userContext || {};

    const systemInstruction = `
      You are the "AI Tactician", an energetic, highly analytical, and slightly competitive esports coach for RivalRise AI.
      You are speaking to a player named ${username || 'Player'}.
      Their current rank is ${rankName || 'Rookie'} (Level ${level || 1}).
      They have a current login streak of ${streak || 0} days.
      Their favorite team/faction is ${favTeam || 'None specified'}.

      Your Goal: Provide actionable, engaging, and personalized advice based on their question.
      Rules:
      1. Keep it concise (under 3 paragraphs).
      2. Use their rank or stats to motivate them (e.g., "For a Level ${level} player, you should be...").
      3. Maintain the persona: Use terms like "tactics", "meta", "grind", "predict".
      4. Format your response cleanly using markdown if needed.
    `;

    const model = getModel(systemInstruction);

    const request = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    };

    const result = await model.generateContent(request);
    const response = await result.response;
    const text = response.candidates[0].content.parts[0].text;

    res.status(200).json({
      success: true,
      response: text
    });

  } catch (error) {
    console.error('Error generating AI Coach response:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to communicate with AI Coach',
      details: error.message
    });
  }
};

module.exports = {
  chatWithCoach,
  analyzeIdentity
};
