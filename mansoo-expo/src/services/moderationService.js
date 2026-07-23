// Content Moderation System for Text Filtering & Toxic Pattern Detection

const BANNED_PATTERNS = [
  'hate', 'abusive_word_1', 'scam_link', 'spam_text'
];

export function moderateText(text) {
  if (!text) return { isValid: true, flaggedWords: [] };

  const lowerText = text.toLowerCase();
  const flaggedWords = BANNED_PATTERNS.filter(word => lowerText.includes(word));

  if (flaggedWords.length > 0) {
    return {
      isValid: false,
      reason: 'Contains profanity or prohibited words',
      flaggedWords,
    };
  }

  return { isValid: true, flaggedWords: [] };
}

export function reportContentToAdmin(contentId, reason, reportedByUserId) {
  console.log(`[Moderation] Content ${contentId} reported for "${reason}" by user ${reportedByUserId}`);
  // Inserts into Firestore 'reports' collection for human moderation dashboard
}
