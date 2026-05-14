const { VertexAI } = require('@google-cloud/vertexai');
require('dotenv').config();

const project = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || 'fanverse-ai-c706e';
const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

// Initialize Vertex AI
const vertexAI = new VertexAI({ project, location });

/**
 * Returns a Gemini 1.5 Flash model instance
 * @param {string} systemInstruction - Optional system instruction
 */
const getModel = (systemInstruction) => {
  return vertexAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: systemInstruction ? {
      role: 'system',
      parts: [{ text: systemInstruction }]
    } : undefined
  });
};

const aiClient = getModel();

module.exports = { aiClient, vertexAI, getModel };
