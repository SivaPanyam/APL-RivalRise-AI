/**
 * Core mathematical utilities for the Progression and Streak engine.
 */

export const FAN_RANKS = [
  { level: 1, name: 'Rookie', color: 'text-slate-400', bg: 'bg-slate-400/10', border: 'border-slate-400/30' },
  { level: 10, name: 'Strategist', color: 'text-brand-400', bg: 'bg-brand-500/10', border: 'border-brand-500/30' },
  { level: 25, name: 'Analyst', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { level: 50, name: 'Elite Fan', color: 'text-accent-400', bg: 'bg-accent-500/10', border: 'border-accent-500/30' },
  { level: 100, name: 'Rival Legend', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' }
];

/**
 * Calculates the total XP required to reach a specific level.
 * Uses an exponential scaling curve: level * 1000 * 1.2
 */
export function calculateXpForLevel(level) {
  if (level <= 1) return 0;
  return Math.floor(level * 1000 * 1.2);
}

/**
 * Calculates the current level based on total XP.
 */
export function calculateLevelFromXp(totalXp) {
  if (!totalXp || totalXp <= 0) return 1;
  
  let level = 1;
  while (totalXp >= calculateXpForLevel(level + 1)) {
    level++;
  }
  return level;
}

/**
 * Determines the current Fan Rank based on the user's level.
 */
export function getFanRank(level) {
  // Reverse the array to find the highest applicable rank first
  const reversedRanks = [...FAN_RANKS].reverse();
  const rank = reversedRanks.find(r => level >= r.level);
  return rank || FAN_RANKS[0];
}

/**
 * Calculates the progress percentage (0-100) towards the next level.
 */
export function getLevelProgress(totalXp) {
  const currentLevel = calculateLevelFromXp(totalXp);
  const currentLevelXp = calculateXpForLevel(currentLevel);
  const nextLevelXp = calculateXpForLevel(currentLevel + 1);
  
  const xpIntoCurrentLevel = totalXp - currentLevelXp;
  const xpNeededForNextLevel = nextLevelXp - currentLevelXp;
  
  const rawPercentage = (xpIntoCurrentLevel / xpNeededForNextLevel) * 100;
  return Math.min(Math.max(rawPercentage, 0), 100);
}
