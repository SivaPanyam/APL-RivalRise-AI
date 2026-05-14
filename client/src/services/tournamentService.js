import DatabaseService, { COLLECTIONS } from './dbService';
import { db } from '../config/firebase';
import { collection, query, where, getDocs, setDoc, doc, serverTimestamp } from 'firebase/firestore';

const MOCK_MATCHES = [
  { teamA: "Cyber Ninjas", teamB: "Neon Dragons", date: new Date(Date.now() + 86400000).toISOString(), status: "upcoming", rewardXP: 100 },
  { teamA: "Quantum Strikers", teamB: "Plasma FC", date: new Date(Date.now() + 172800000).toISOString(), status: "upcoming", rewardXP: 150 },
  { teamA: "Apex Sentinels", teamB: "Rogue Titans", date: new Date(Date.now() + 259200000).toISOString(), status: "upcoming", rewardXP: 200 }
];

class TournamentService {
  /**
   * Automatically seeds mock matches into Firestore if none exist.
   * Useful for development and initial testing.
   */
  static async seedMockMatchesIfEmpty() {
    try {
      const q = query(collection(db, COLLECTIONS.TOURNAMENTS));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        console.log("[TournamentService] No matches found. Seeding mock data...");
        for (const match of MOCK_MATCHES) {
          await DatabaseService.add(COLLECTIONS.TOURNAMENTS, match);
        }
        console.log("[TournamentService] Seeding complete.");
      }
    } catch (error) {
      console.error("Failed to seed mock matches:", error);
    }
  }

  /**
   * Submits a fan prediction for a specific match.
   * Creates a structured document in the 'predictions' collection.
   */
  static async submitPrediction(userId, matchId, predictedWinner) {
    if (!userId || !matchId || !predictedWinner) throw new Error("Invalid prediction payload");

    // We use a composite ID so a user can only have one prediction per match
    const predictionId = `${userId}_${matchId}`;
    const predictionRef = doc(db, COLLECTIONS.PREDICTIONS, predictionId);

    const predictionData = {
      userId,
      matchId,
      predictedWinner,
      status: 'pending', // Will be 'won' or 'lost' when the match concludes
      createdAt: serverTimestamp()
    };

    await setDoc(predictionRef, predictionData);
    
    // Log the engagement event using the DB Service
    await DatabaseService.logEngagementEvent(userId, 'PREDICTION_MADE', { matchId, predictedWinner });

    return predictionData;
  }

  /**
   * Fetches all predictions made by a specific user.
   */
  static async getUserPredictions(userId) {
    if (!userId) return [];
    
    const q = query(
      collection(db, COLLECTIONS.PREDICTIONS),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

export default TournamentService;
