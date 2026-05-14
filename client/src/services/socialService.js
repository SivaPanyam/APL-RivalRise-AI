import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp, 
  limit 
} from 'firebase/firestore';

class SocialService {
  /**
   * Subscribes to real-time messages for a specific channel.
   * @param {string} channelId - The ID of the channel.
   * @param {function} callback - Function to call with updated messages array.
   * @returns {function} Unsubscribe function.
   */
  static subscribeToMessages(channelId, callback) {
    // Construct path: channels/{channelId}/messages
    const messagesRef = collection(db, 'channels', channelId, 'messages');
    
    // Query ordered by creation time, limiting to last 100 messages for performance
    const q = query(messagesRef, orderBy('createdAt', 'asc'), limit(100));

    // onSnapshot sets up a real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(messages);
    }, (error) => {
      console.error("Error subscribing to messages:", error);
    });

    return unsubscribe;
  }

  /**
   * Sends a message to a specific channel.
   * @param {string} channelId - The ID of the channel.
   * @param {object} messageData - { text, userId, username, userRank, userAvatar }
   */
  static async sendMessage(channelId, messageData) {
    try {
      const messagesRef = collection(db, 'channels', channelId, 'messages');
      await addDoc(messagesRef, {
        ...messageData,
        createdAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }
}

export default SocialService;
