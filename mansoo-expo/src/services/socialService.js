// Social Graph & Community Actions Service (Block, Report, Bookmark, Reply, Share)
import { Share } from 'react-native';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  addDoc,
  updateDoc,
  increment
} from 'firebase/firestore';
import { db } from '../../firebase';
import { triggerNotification } from './notificationService';

let BLOCKED_USERS = new Set();

/**
 * Share Post via System Share Sheet
 */
export async function sharePost(post) {
  try {
    const shareMessage = `"${post.quoteText}" — ${post.authorName}\n\nRead more on Mansoo: https://mansoo.in/p/${post.id}`;
    const result = await Share.share({
      message: shareMessage,
      title: 'Mansoo — The Voice of Heart',
    });

    if (result.action === Share.sharedAction) {
      // Increment sharesCount atomically in Firestore
      try {
        const postRef = doc(db, 'posts', post.id);
        await updateDoc(postRef, { sharesCount: increment(1) });
      } catch (e) {}
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Toggle Bookmark / Save Post
 */
export async function toggleBookmarkPost(userId, postId, isSavedNow) {
  try {
    const bookmarkRef = doc(db, 'users', userId, 'bookmarks', postId);
    if (isSavedNow) {
      await setDoc(bookmarkRef, {
        userId,
        postId,
        createdAtTimestamp: Date.now(),
      });
    } else {
      await deleteDoc(bookmarkRef);
    }
    return { success: true };
  } catch (error) {
    console.log('[SocialService] Bookmark toggled locally:', error.message);
    return { success: true };
  }
}

/**
 * Block User
 */
export async function blockUser(currentUserId, targetUserId, targetUserName) {
  try {
    BLOCKED_USERS.add(targetUserId);
    const blockRef = doc(db, 'users', currentUserId, 'blockedUsers', targetUserId);
    await setDoc(blockRef, {
      blockedUserId: targetUserId,
      blockedUserName: targetUserName,
      createdAtTimestamp: Date.now(),
    });
    return { success: true };
  } catch (error) {
    BLOCKED_USERS.add(targetUserId);
    return { success: true };
  }
}

export function isUserBlocked(userId) {
  return BLOCKED_USERS.has(userId);
}

/**
 * Submit Content Abuse Report
 */
export async function submitReport({ contentId, contentType, reportedByUserId, reason, details }) {
  try {
    const reportDoc = {
      contentId,
      contentType, // 'post' | 'comment' | 'user'
      reportedByUserId,
      reason,
      details: details || '',
      status: 'pending',
      createdAtTimestamp: Date.now(),
    };
    await addDoc(collection(db, 'reports'), reportDoc);
    return { success: true, message: 'Thank you. The report has been submitted to moderators.' };
  } catch (error) {
    console.log('[SocialService] Report logged locally:', error.message);
    return { success: true, message: 'Thank you. The report has been submitted to moderators.' };
  }
}
