# RivalRise AI: The Intelligent Esports Engagement Platform

[![Built with Gemini](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-blueviolet?style=for-the-badge)](https://ai.google.dev/)
[![Built with Firebase](https://img.shields.io/badge/Backend-Firebase%20%26%20Node.js-orange?style=for-the-badge)](https://firebase.google.com/)
[![Docker Ready](https://img.shields.io/badge/Deployment-Docker%20%26%20Cloud%20Run-blue?style=for-the-badge)](https://cloud.google.com/run)

## 1. Project Overview
**RivalRise AI** is a next-generation esports gamification platform designed to transform passive viewers into active, engaged participants. By leveraging state-of-the-art AI, real-time data synchronization, and deep behavioral analysis, RivalRise creates a personalized ecosystem where every fan's journey is unique.

## 2. Problem Statement
The esports industry suffers from high viewer churn and shallow engagement. Traditional platforms offer generic experiences that fail to recognize individual fan expertise, loyalty, or tactical intelligence. Fans lack a sense of progression and meaningful community identity.

## 3. Solution Approach
RivalRise AI solves this by introducing an **Adaptive Engagement System**. We move beyond static leaderboards to a dynamic, AI-orchestrated environment that evolves based on user behavior, providing personalized missions, context-aware coaching, and a unique fan identity engine.

## 4. AI Adaptive Engagement System
Powered by **Google Gemini 2.5 Flash**, our engagement engine analyzes user activity in real-time:
*   **Adaptive Mission Orchestration**: Gemini generates daily challenges tailored to the user's favorite teams and current skill level.
*   **Smart Notification Engine**: Personalized, archetype-aware push notifications that trigger based on engagement patterns.
*   **Tactical AI Coach**: A real-time assistant that provides data-driven match insights and prediction tips.

## 5. Gamification Features
*   **The Vault (Reward Economy)**: A tiered system of "Rival Coins," XP, and collectible digital badges.
*   **Progression Engine**: A sophisticated leveling system with dynamic ranks (Recruit to Legend).
*   **Social Fanzone**: Discord-inspired real-time chat hubs with rank-aware visibility and live activity indicators.

## 6. Tournament Architecture
*   **Live Brackets**: Real-time synchronization of tournament progress using Firestore `onSnapshot`.
*   **Prediction Arena**: A high-stakes environment where fans can leverage AI insights to climb the global rankings.
*   **Strategic Scoring**: Points are awarded not just for correct predictions, but for tactical consistency.

## 7. Fan Identity Engine
One of RivalRise's core innovations, the **Fan Identity Engine**, uses Gemini to classify fans into unique archetypes:
*   **Tactical Analyst**: Focused on deep match data.
*   **Loyal Supporter**: Consistent engagement with a specific faction.
*   **Clutch Predictor**: High accuracy in high-stakes matches.
*   **Social Leader**: High activity in the Fanzone.

## 8. Google Services Used
*   **Google Gemini 2.5 Flash**: Core AI orchestration, narrative generation, and behavioral analysis.
*   **Firebase Authentication**: Secure, enterprise-grade identity management.
*   **Cloud Firestore**: Real-time database for social features and live tournament updates.
*   **Google Cloud Run**: Serverless container hosting for the Node.js/Express backend.
*   **Firebase Cloud Messaging (FCM)**: Intelligent push notifications.

## 9. Tech Stack
*   **Frontend**: React (Vite), Framer Motion (Animations), Tailwind CSS, Lucide Icons.
*   **Backend**: Node.js, Express.js.
*   **Database**: Cloud Firestore.
*   **AI**: Google Generative AI SDK.
*   **Infrastructure**: Docker, Google Cloud Run.

## 10. Architecture
RivalRise follows a **Modular Service-Oriented Architecture**:
*   **Controller Layer**: Handles HTTP requests and response sanitization.
*   **Service Layer**: Encapsulates business logic (Progression, Engagement Scoring).
*   **AI Orchestration Layer**: Centralized management of Gemini interactions.
*   **Real-time Layer**: Firestore listeners providing sub-second UI updates.

## 11. Setup Instructions
### Prerequisites
*   Node.js (v18+)
*   Firebase Project with Firestore & Auth enabled
*   Google Gemini API Key

### Local Installation
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/SivaPanyam/APL-RivalRise-AI.git
    cd APL-RivalRise-AI
    ```
2.  **Install dependencies**:
    ```bash
    # Root
    npm install
    # Frontend
    cd client && npm install
    # Backend
    cd ../server && npm install
    ```
3.  **Environment Setup**: Create a `.env` in the `server` directory:
    ```env
    GEMINI_API_KEY=your_key_here
    PORT=5000
    ```
4.  **Run Dev Server**:
    ```bash
    # From root
    npm run dev
    ```

## 12. Deployment Guide
The project is containerized using a multi-stage Docker build.
1.  **Build the image**:
    ```bash
    docker build -t rivalrise-ai .
    ```
2.  **Deploy to Cloud Run**:
    ```bash
    gcloud run deploy rivalrise-ai --image rivalrise-ai --platform managed
    ```

## 13. Accessibility Features
*   **High Contrast UI**: Designed for maximum legibility in competitive environments.
*   **Semantic HTML**: Full support for screen readers across all interactive components.
*   **Responsive Design**: Optimized for mobile, tablet, and desktop viewers.

## 14. Security Measures
*   **Centralized Error Handling**: Prevents stack trace leakage.
*   **Environment Security**: API keys are managed via server-side secrets.
*   **Sanitized AI Outputs**: Strict prompt engineering to ensure safe and relevant content.

## 15. Future Enhancements
*   **Live Stream Integration**: Real-time overlay sync with Twitch/YouTube APIs.
*   **Pro-Player Insights**: AI analysis of professional player performance data.
*   **Faction Wars**: Global community-based missions with seasonal territory rewards.

---
**Developed for the Advanced Agentic Coding Challenge.**
