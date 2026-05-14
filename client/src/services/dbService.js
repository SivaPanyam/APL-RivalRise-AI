import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';

// Core Collection Constants
export const COLLECTIONS = {
  USERS: 'users',
  MISSIONS: 'missions',
  TOURNAMENTS: 'tournaments',
  PREDICTIONS: 'predictions',
  REWARDS: 'rewards',
  STREAKS: 'streaks',
  LEADERBOARD: 'leaderboard',
  AI_PROFILES: 'aiProfiles',
  ENGAGEMENT_HISTORY: 'engagementHistory',
  NOTIFICATIONS: 'notifications'
};

/**
 * Generic Service class for interacting with Firestore.
 * Can be instantiated for specific collections or used statically.
 */
class DatabaseService {
  
  // Base CRUD Operations
  
  static async getById(collectionName, id) {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  }

  static async getAll(collectionName) {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async add(collectionName, data) {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  }

  static async update(collectionName, id, data) {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return true;
  }

  static async delete(collectionName, id) {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    return true;
  }

  // --- Specific Domain Queries ---

  /**
   * Fetches the top N players for the global leaderboard.
   */
  static async getGlobalLeaderboard(limitCount = 50) {
    const q = query(
      collection(db, COLLECTIONS.USERS),
      orderBy('xp', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  /**
   * Fetches active missions for a specific user.
   */
  static async getUserActiveMissions(userId) {
    const q = query(
      collection(db, COLLECTIONS.MISSIONS),
      where('userId', '==', userId),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  /**
   * Logs a new engagement event (e.g., login, mission complete, prediction made).
   */
  static async logEngagementEvent(userId, eventType, metadata = {}) {
    return await this.add(COLLECTIONS.ENGAGEMENT_HISTORY, {
        userId,
        eventType,
        metadata,
    });
  }
}

export default DatabaseService;
