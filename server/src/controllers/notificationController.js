const { generateSmartAlert } = require('../ai/notificationEngine');

/**
 * Triggers a smart notification for a user.
 * For this prototype, it uses Gemini to generate the copy and mocks the FCM dispatch.
 */
const triggerSmartAlert = async (req, res) => {
  try {
    const { userContext, eventType, fcmToken } = req.body;

    if (!userContext || !eventType) {
      return res.status(400).json({ error: 'userContext and eventType are required' });
    }

    // 1. Generate personalized notification via AI
    const alertData = await generateSmartAlert(userContext, eventType);

    // 2. Mock the FCM Dispatch
    console.log('\n=================================================');
    console.log('🚀 [MOCK FCM DISPATCH] AI SMART NOTIFICATION SENT');
    console.log('=================================================');
    console.log(`To Token: ${fcmToken || 'NO_TOKEN_PROVIDED'}`);
    console.log(`Title:    ${alertData.title}`);
    console.log(`Body:     ${alertData.body}`);
    console.log('=================================================\n');

    // In a real production environment with Firebase Admin SDK, we would do:
    // const admin = require('firebase-admin');
    // await admin.messaging().send({ token: fcmToken, notification: alertData });

    res.status(200).json({
      success: true,
      message: 'Smart alert generated and mocked dispatch logged.',
      alertData
    });
  } catch (error) {
    console.error('Error triggering smart alert:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to trigger smart alert',
      details: error.message
    });
  }
};

module.exports = {
  triggerSmartAlert
};
