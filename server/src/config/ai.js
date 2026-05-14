const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

let aiClient;
if (process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} else {
    console.warn("GEMINI_API_KEY not set. AI features will be disabled.");
}

module.exports = { aiClient };
