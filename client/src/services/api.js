const API_BASE_URL = '/api';

class ApiService {
  /**
   * Generates a new personalized AI mission.
   */
  static async generateMission(userId, userStats, sportPreference) {
    try {
      const response = await fetch(`${API_BASE_URL}/missions/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, userStats, sportPreference }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate mission');
      }

      const data = await response.json();
      return data.mission;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * Sends a prompt to the AI Coach.
   */
  static async chatWithCoach(prompt, userContext) {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/coach/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, userContext }),
      });

      if (!response.ok) {
        throw new Error('Failed to chat with coach');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * Generates an AI Fan Identity based on stats and prediction history.
   */
  static async analyzeFanIdentity(userData, predictions) {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/identity/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userData, predictions }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze identity');
      }

      const data = await response.json();
      return data.identity;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}

export default ApiService;
