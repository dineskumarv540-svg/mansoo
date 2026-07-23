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
    const newPost = {
      ...postData,
      createdAtTimestamp: Date.now(),
      serverTimestamp: serverTimestamp(),
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isFeatured: false,
    };

    const docRef = await addDoc(collection(db, POSTS_COLLECTION), newPost);
    return { success: true, id: docRef.id, post: { id: docRef.id, ...newPost } };
  } catch (error) {
    console.log('[Firestore] Local fallback post creation:', error.message);
    const mockId = 'p_' + Date.now();
    return {
      success: true,
      id: mockId,
      post: { id: mockId, ...postData, likesCount: 0, commentsCount: 0 }
    };
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
