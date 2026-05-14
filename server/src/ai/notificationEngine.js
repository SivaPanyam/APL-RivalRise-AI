const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateSmartAlert = async (userContext, eventType) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing');
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: `You are the AI Notification Engine for RivalRise, a competitive sports/esports gamification platform.
Your job is to generate a short, punchy, and highly personalized push notification message for a user.

Event Types:
- "STREAK_REMINDER": Remind them to log in so they don't lose their streak.
- "MISSION_COMPLETE": Congratulate them on finishing a mission.
- "REWARD_UNLOCK": Let them know a new badge is available in their Vault.
- "LEADERBOARD_DROP": Warn them that they are losing rank.

Rules:
1. Tone: Energetic, competitive, and tailored to their "archetype" if provided.
2. Length: Max 120 characters. Short and punchy for a mobile push notification.
3. Response Format: Return ONLY a strict JSON object with a 'title' and 'body'. No markdown blocks.

Example output:
{
  "title": "Your Streak is in Danger! ⚠️",
  "body": "Tactician, log in now to lock in your Day 5 streak before you lose your momentum."
}`,
  });

  const prompt = `Generate a "${eventType}" notification for this user:
Username: ${userContext.username || 'Fan'}
Level: ${userContext.level || 1}
Current Streak: ${userContext.streak || 0}
Archetype: ${userContext.archetype || 'Loyal Supporter'}`;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error generating smart notification:', error);
    // Fallback static notification
    return {
      title: "RivalRise Alert!",
      body: `You have a new ${eventType.toLowerCase().replace('_', ' ')} update waiting for you.`
    };
  }
};

module.exports = {
  generateSmartAlert
};
