// Firestore TypeScript Type Definitions for Mansoo App Data Schemas

import { Timestamp } from 'firebase/firestore';

/**
 * 1. Users Collection Document
 * Path: /users/{userId}
 */
export interface UserDocument {
  uid: string;
  name: string;
  handle: string; // e.g. @aarav_writes
  email: string;
  bio: string;
  avatarUrl: string;
  coverImageUrl?: string;
  website?: string;
  isVerified: boolean;
  isPro: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  fcmPushToken?: string;
  createdAt: number | Timestamp;
  updatedAt?: number | Timestamp;
}

/**
 * 2. Posts Collection Document
 * Path: /posts/{postId}
 */
export interface PostDocument {
  id: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  authorAvatarUrl: string;
  isVerified: boolean;
  quoteText: string;
  category: 'Nature' | 'Love' | 'Politics' | 'Humor' | 'Jokes' | 'Sadness' | 'Poem' | 'Shayari' | 'Quotes' | 'Story' | 'Life' | 'Meme';
  backgroundImageUrl?: string;
  backgroundColor?: string;
  fontStyle: 'Serif' | 'Sans' | 'Monospace' | 'Cursive';
  textColor: string | number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount?: number;
  trendingScore?: number;
  isFeatured: boolean;
  tags: string[];
  createdAtTimestamp: number;
  createdAt?: Timestamp;
}

/**
 * 3. Comments Collection Document
 * Path: /posts/{postId}/comments/{commentId} OR /comments/{commentId}
 */
export interface CommentDocument {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string;
  text: string;
  likesCount: number;
  createdAtTimestamp: number;
  createdAt?: Timestamp;
}

/**
 * 4. Likes Collection Document
 * Path: /posts/{postId}/likes/{userId} OR /likes/{likeId}
 */
export interface LikeDocument {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  createdAtTimestamp: number;
  createdAt?: Timestamp;
}

/**
 * 5. Bookmarks Collection Document
 * Path: /users/{userId}/bookmarks/{postId} OR /bookmarks/{bookmarkId}
 */
export interface BookmarkDocument {
  id: string;
  userId: string;
  postId: string;
  createdAtTimestamp: number;
  createdAt?: Timestamp;
}

/**
 * 6. Followers Collection Document
 * Path: /users/{userId}/followers/{followerUserId}
 */
export interface FollowerDocument {
  userId: string;         // Target user being followed
  followerId: string;     // User who initiated follow
  followerName: string;
  followerAvatarUrl: string;
  createdAtTimestamp: number;
  createdAt?: Timestamp;
}

/**
 * 7. Following Collection Document
 * Path: /users/{userId}/following/{targetUserId}
 */
export interface FollowingDocument {
  userId: string;         // User initiating follow
  targetUserId: string;   // User being followed
  targetName: string;
  targetAvatarUrl: string;
  createdAtTimestamp: number;
  createdAt?: Timestamp;
}

/**
 * 8. Notifications Collection Document
 * Path: /notifications/{notificationId}
 */
export interface NotificationDocument {
  id: string;
  recipientId: string;    // Target user receiving alert
  senderId: string;       // User acting
  senderName: string;
  senderAvatarUrl: string;
  type: 'like' | 'comment' | 'follow' | 'save' | 'challenge' | 'system';
  actionText: string;
  postId?: string;
  isRead: boolean;
  createdAtTimestamp: number;
  createdAt?: Timestamp;
}

/**
 * 9. Stories Collection Document
 * Path: /stories/{storyId}
 */
export interface StoryDocument {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl: string;
  isVerified: boolean;
  mediaUrl: string;
  type: 'image' | 'text';
  caption?: string;
  expiresAtTimestamp: number;
  createdAtTimestamp: number;
  createdAt?: Timestamp;
}

/**
 * 10. Reports Collection Document
 * Path: /reports/{reportId}
 */
export interface ReportDocument {
  id: string;
  contentId: string;      // ID of reported post, comment or user
  contentType: 'post' | 'comment' | 'user';
  reportedByUserId: string;
  reason: string;
  details?: string;
  status: 'pending' | 'reviewed' | 'actioned' | 'dismissed';
  createdAtTimestamp: number;
  createdAt?: Timestamp;
}
