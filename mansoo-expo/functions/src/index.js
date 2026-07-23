const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { z } = require('zod');
const BadWords = require('bad-words');
const profanityFilter = new BadWords();

admin.initializeApp();

// Simple schema example for creating a post
const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  imageUrl: z.string().url().optional(),
});

exports.createPost = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const parseResult = createPostSchema.safeParse(data);
  if (!parseResult.success) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid post data');
  }
  const post = parseResult.data;

  // Profanity check (supports additional language lists if needed)
  if (profanityFilter.isProfane(post.title) || profanityFilter.isProfane(post.content)) {
    throw new functions.https.HttpsError('failed-precondition', 'Profanity detected');
  }

  // Rate limiting example (max 5 posts per hour)
  const userId = context.auth.uid;
  const rateRef = admin.firestore().collection('rateLimits').doc(userId);
  const rateSnap = await rateRef.get();
  const now = admin.firestore.Timestamp.now();
  let counts = { posts: 0, lastReset: now };
  if (rateSnap.exists) {
    const data = rateSnap.data();
    const elapsed = now.seconds - data.lastReset.seconds;
    if (elapsed > 3600) {
      // Reset every hour
      counts = { posts: 0, lastReset: now };
    } else {
      counts = { posts: data.posts || 0, lastReset: data.lastReset };
    }
  }
  if (counts.posts >= 5) {
    throw new functions.https.HttpsError('resource-exhausted', 'Rate limit exceeded');
  }
  counts.posts += 1;
  await rateRef.set(counts);

  const docRef = await admin.firestore().collection('posts').add({
    ...post,
    authorId: userId,
    createdAt: now,
    likesCount: 0,
    commentsCount: 0,
    sharesCount: 0,
  });
  return { id: docRef.id };
});

// Report content callable
exports.reportContent = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  const reportSchema = z.object({
    reportedByUserId: z.string(),
    targetId: z.string(),
    type: z.enum(['post', 'comment', 'profile']),
    reason: z.string().min(5),
  });
  const result = reportSchema.safeParse(data);
  if (!result.success) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid report data');
  }
  await admin.firestore().collection('reports').add({
    ...result.data,
    reportedAt: admin.firestore.Timestamp.now(),
    status: 'pending',
  });
  return { success: true };
});
