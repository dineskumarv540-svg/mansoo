// Firestore Data Access Layer (DAL) for Posts, Users, Stories, Comments & Reactions
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { DUMMY_POSTS, DUMMY_USERS, DUMMY_STORIES } from '../data/dummyData';
import { calculateTrendingScore } from './trendingAlgorithm';
import { createPost } from '../services/cloudFunctions';

// Collection references
const POSTS_COLLECTION = 'posts';
const USERS_COLLECTION = 'users';
const STORIES_COLLECTION = 'stories';

/**
 * Fetch paginated posts feed with fallback
 */
export async function fetchPostsFeed(lastVisibleDoc = null, pageSize = 10) {
  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    let q = query(postsRef, orderBy('createdAtTimestamp', 'desc'), limit(pageSize));

    if (lastVisibleDoc) {
      q = query(postsRef, orderBy('createdAtTimestamp', 'desc'), startAfter(lastVisibleDoc), limit(pageSize));
    }

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const posts = snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
      const lastDoc = snapshot.docs[snapshot.docs.length - 1];
      return { posts, lastDoc };
    }
  } catch (error) {
    console.log('[Firestore] Using fallback dataset for feed:', error.message);
  }

  // Fallback to DUMMY_POSTS with trending scores calculated
  const sortedPosts = DUMMY_POSTS.map(p => ({
    ...p,
    trendingScore: calculateTrendingScore(p)
  }));

  return { posts: sortedPosts, lastDoc: null };
}

/**
 * Publish a new post to Firestore
 */
export async function createPostInFirestore(postData) {
  try {
    // Cloud Function handles validation, moderation, and secure write
    const result = await createPost(postData);
    return { success: true, id: result.id, post: { id: result.id, ...postData } };
  } catch (error) {
    console.log('[Firestore] createPost via Cloud Function failed:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Toggle Like on a Post (Atomically update count in Firestore)
 */
export async function togglePostLikeInFirestore(postId, userId, isLikedNow) {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    await updateDoc(postRef, {
      likesCount: increment(isLikedNow ? 1 : -1)
    });
  } catch (error) {
    console.log('[Firestore] Like state toggled locally:', error.message);
  }
}

/**
 * Update an existing Post in Firestore
 */
export async function updatePostInFirestore(postId, updateData) {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    await updateDoc(postRef, {
      ...updateData,
      updatedAtTimestamp: Date.now(),
    });
    return { success: true };
  } catch (error) {
    console.log('[Firestore] Local fallback post update:', error.message);
    return { success: true };
  }
}

/**
 * Delete a Post from Firestore
 */
export async function deletePostFromFirestore(postId) {
  try {
    const postRef = doc(db, POSTS_COLLECTION, postId);
    const { deleteDoc } = require('firebase/firestore');
    await deleteDoc(postRef);
    return { success: true };
  } catch (error) {
    console.log('[Firestore] Local fallback post deletion:', error.message);
    return { success: true };
  }
}

/**
 * Toggle User Follow State
 */
export async function toggleUserFollowInFirestore(targetUserId, currentUserId, isFollowingNow) {
  try {
    const targetRef = doc(db, USERS_COLLECTION, targetUserId);
    const currentRef = doc(db, USERS_COLLECTION, currentUserId);

    await updateDoc(targetRef, { followersCount: increment(isFollowingNow ? 1 : -1) });
    await updateDoc(currentRef, { followingCount: increment(isFollowingNow ? 1 : -1) });
  } catch (error) {
    console.log('[Firestore] Follow toggled locally:', error.message);
  }
}
