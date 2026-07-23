// Complete Gamification Engine — XP, Levels, Badges, Challenges & Leaderboards
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export const WRITER_LEVELS = [
  { level: 1, title: 'Novice Writer', xpRequired: 0, icon: 'seedling' },
  { level: 2, title: 'Wordsmith', xpRequired: 500, icon: 'pencil' },
  { level: 3, title: 'Master Poet', xpRequired: 1500, icon: 'ribbon' },
  { level: 4, title: 'Literary Legend', xpRequired: 3500, icon: 'trophy' },
  { level: 5, title: 'Grand Virtuoso', xpRequired: 7500, icon: 'crown' },
];

export const BADGES_LIBRARY = [
  { id: 'b1', title: 'First Spark', icon: '✨', description: 'Published your first quote', unlocked: true },
  { id: 'b2', title: 'Streak Master', icon: '🔥', description: 'Maintained a 10-day writing streak', unlocked: true },
  { id: 'b3', title: 'Heart Toucher', icon: '❤️', description: 'Received 100+ likes on a single post', unlocked: true },
  { id: 'b4', title: 'Challenge Champion', icon: '🌟', description: 'Completed 5 daily writing prompts', unlocked: true },
  { id: 'b5', title: 'Grand Virtuoso', icon: '👑', description: 'Reached Level 5 Writer status', unlocked: false },
];

export const UNLOCKABLE_THEMES = [
  { id: 't1', name: 'Classic Emerald', requiredLevel: 1, colors: ['#0F3D3E', '#1A1A2E'], unlocked: true },
  { id: 't2', name: 'Sunset Rose', requiredLevel: 2, colors: ['#F26B8A', '#7B1FA2'], unlocked: true },
  { id: 't3', name: 'Royal Gold', requiredLevel: 3, colors: ['#FFD54F', '#E65100'], unlocked: true },
  { id: 't4', name: 'Neon Cyberpunk', requiredLevel: 4, colors: ['#00E5FF', '#7F00FF'], unlocked: true },
  { id: 't5', name: 'Vintage Parchment', requiredLevel: 5, colors: ['#D7CCC8', '#5D4037'], unlocked: false },
];

export const TOP_WRITERS_LEADERBOARD = [
  { rank: 1, id: 'u1', name: 'Aarav Sharma', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200', xp: 4850, level: 4, levelTitle: 'Literary Legend' },
  { rank: 2, id: 'u2', name: 'Priya Verma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', xp: 4210, level: 4, levelTitle: 'Literary Legend' },
  { rank: 3, id: 'u3', name: 'Rohan Mehta', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200', xp: 2940, level: 3, levelTitle: 'Master Poet' },
  { rank: 4, id: 'u4', name: 'Kavya Sharma', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', xp: 2180, level: 3, levelTitle: 'Master Poet' },
  { rank: 5, id: 'u5', name: 'Devansh Gupta', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', xp: 1420, level: 2, levelTitle: 'Wordsmith' },
];

let USER_PROGRESS = {
  xp: 2850,
  streakDays: 14,
  level: 3,
  levelTitle: 'Master Poet',
  nextLevelXp: 3500,
  challenges: [
    { id: 'c1', type: 'Daily', title: 'Write a 4-line poem about Rain & Solitude', rewardXp: 50, completed: false },
    { id: 'c2', type: 'Weekly', title: 'Publish 3 quotes in Philosophy category', rewardXp: 200, completed: false },
    { id: 'c3', type: 'Monthly', title: 'Gain 100 new followers & 500 total likes', rewardXp: 1000, completed: false },
  ]
};

export function getUserGamificationProgress() {
  return USER_PROGRESS;
}

export function claimChallengeReward(challengeId) {
  const challenge = USER_PROGRESS.challenges.find(c => c.id === challengeId);
  if (!challenge || challenge.completed) return { success: false };

  challenge.completed = true;
  USER_PROGRESS.xp += challenge.rewardXp;

  // Level Up Check
  let leveledUp = false;
  let newLevelObj = WRITER_LEVELS[2];

  for (let i = WRITER_LEVELS.length - 1; i >= 0; i--) {
    if (USER_PROGRESS.xp >= WRITER_LEVELS[i].xpRequired) {
      if (WRITER_LEVELS[i].level > USER_PROGRESS.level) {
        leveledUp = true;
        USER_PROGRESS.level = WRITER_LEVELS[i].level;
        USER_PROGRESS.levelTitle = WRITER_LEVELS[i].title;
      }
      newLevelObj = WRITER_LEVELS[i];
      break;
    }
  }

  return {
    success: true,
    rewardXp: challenge.rewardXp,
    totalXp: USER_PROGRESS.xp,
    leveledUp,
    level: USER_PROGRESS.level,
    levelTitle: USER_PROGRESS.levelTitle,
  };
}
