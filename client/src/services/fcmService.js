import { getMessaging, getToken } from 'firebase/messaging';
import { app } from '../config/firebase';

const messaging = getMessaging(app);

class FCMService {
  /**
   * Requests browser permission and generates an FCM token.
   * Note: In a real app, you need a VAPID key from Firebase Console.
   * For this prototype, we mock the token generation if it fails due to missing keys.
   */
  static async requestNotificationPermission() {
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        try {
          // Attempt to get real token (will fail if no VAPID key is configured)
          const token = await getToken(messaging, { 
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || 'MOCK_VAPID_KEY' 
          });
          return token;
        } catch (e) {
          console.warn("FCM Token generation failed (likely missing VAPID key). Returning mock token.", e.message);
          return 'mock-fcm-token-' + Math.random().toString(36).substring(7);
        }
      } else {
        throw new Error('Notification permission denied');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      throw error;
    }
  }

  /**
   * Hits our backend endpoint to manually trigger the Smart Notification.
   */
  static async triggerSmartAlert(userContext, eventType, fcmToken) {
    try {
      const response = await fetch('/api/notifications/trigger-smart-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userContext, eventType, fcmToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to trigger alert');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}

export default FCMService;
