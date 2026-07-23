// Daily Writing Challenge System with Streaks & Reward Badges

export const DAILY_CHALLENGES = [
  {
    id: 'ch_101',
    date: '2026-07-23',
    title: 'Daily Prompt #42',
    prompt: 'Write a 4-line poem about the smell of rain (Petrichor).',
    tag: '#RainSmell',
    rewardCoins: 50,
    participantsCount: 1420,
    hoursLeft: 8,
  },
  {
    id: 'ch_102',
    date: '2026-07-24',
    title: 'Daily Prompt #43',
    prompt: 'Describe a goodbye without using the word "bye" or "farewell".',
    tag: '#SilentGoodbye',
    rewardCoins: 50,
    participantsCount: 890,
    hoursLeft: 24,
  }
];

export function getTodayChallenge() {
  return DAILY_CHALLENGES[0];
}

export function calculateStreak(userSubmissionDates) {
  // Returns consecutive days active
  return userSubmissionDates.length > 0 ? userSubmissionDates.length : 1;
}
