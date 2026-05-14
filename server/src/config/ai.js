const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

let aiClient;
if (process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} else {
    console.warn("GEMINI_API_KEY not set. AI features will be disabled.");
}

module.exports = { aiClient };
