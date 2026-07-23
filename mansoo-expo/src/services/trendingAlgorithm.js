// High-Scale Trending Score Algorithm for 100k+ Active Users
// Formula: S = (U + 2*L + 3*C + 5*Sh) / (AgeInHours + 2)^1.5

export function calculateTrendingScore(post) {
  const L = post.likesCount || 0;      // Weight = 2
  const C = post.commentsCount || 0;   // Weight = 3
  const Sh = post.sharesCount || 0;    // Weight = 5
  const U = post.viewsCount || 10;     // Weight = 1

  const createdAt = post.createdAtTimestamp || Date.now() - 3600000 * 4;
  const ageInHours = (Date.now() - createdAt) / (1000 * 60 * 60);

  const gravity = 1.5;
  const score = (U + (2 * L) + (3 * C) + (5 * Sh)) / Math.pow(ageInHours + 2, gravity);

  return parseFloat(score.toFixed(2));
}

export function sortPostsByTrending(posts) {
  return [...posts].sort((a, b) => calculateTrendingScore(b) - calculateTrendingScore(a));
}
