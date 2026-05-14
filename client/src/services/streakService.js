import DatabaseService, { COLLECTIONS } from './dbService';

class StreakService {
  /**
   * Evaluates and updates the user's login streak upon authentication.
   * Logic:
   * - If lastLogin is today, do nothing.
   * - If lastLogin was yesterday, increment streak.
   * - If lastLogin was > yesterday, reset streak to 1.
   * 
   * @param {string} userId - The authenticated user's ID
   * @param {Object} userData - The user's current Firestore document
   */
  static async evaluateDailyLogin(userId, userData) {
    if (!userId || !userData) return;

    const now = new Date();
    const lastLoginStr = userData.lastLogin;
    
    let currentStreak = userData.streak || 0;
    let shouldUpdate = false;

    if (!lastLoginStr) {
      // First time login
      currentStreak = 1;
      shouldUpdate = true;
    } else {
      const lastLogin = new Date(lastLoginStr);
      
      // Calculate day difference (ignoring time)
      const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lastLoginMidnight = new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate());
      
      const diffTime = Math.abs(nowMidnight - lastLoginMidnight);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Logged in yesterday, keep the streak alive!
        currentStreak += 1;
        shouldUpdate = true;
      } else if (diffDays > 1) {
        // Streak broken
        currentStreak = 1;
        shouldUpdate = true;
      }
      // If diffDays === 0, they already logged in today, do nothing.
    }

    // Only hit Firestore if the streak changed or it's a new day
    if (shouldUpdate || !lastLoginStr || new Date(lastLoginStr).getDate() !== now.getDate()) {
      await DatabaseService.update(COLLECTIONS.USERS, userId, {
        streak: currentStreak,
        lastLogin: now.toISOString()
      });
      console.log(`[StreakService] User ${userId} login evaluated. Current Streak: ${currentStreak}`);
    }
  }
}

export default StreakService;
