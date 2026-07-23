# 🗄️ Mansoo — Firestore Database Architecture & Security Specification

Complete document schema specification, security rules, and performance indexes for all 10 Firestore collections in the **Mansoo** social writing platform.

---

## 📑 10 Firestore Collections Schema Summary

```
/users/{userId}                    - User profiles, follower stats, bio & FCM push tokens
/posts/{postId}                    - User posts, quote cards, images & interaction counts
  ├── /comments/{commentId}        - Nested post comments & replies
  └── /likes/{userId}              - Subcollection tracking user likes
/comments/{commentId}              - Global comments index
/likes/{likeId}                    - Global likes document index
/bookmarks/{bookmarkId}            - User saved/bookmarked quotes
/followers/{followerId}            - User follower relationship index
/following/{followingId}           - User following relationship index
/notifications/{notificationId}    - Activity feed alerts (likes, comments, follows)
/stories/{storyId}                 - 24-hour expiring visual/text stories
/reports/{reportId}                - Flagged content & abuse reports queue (Admin SDK only)
```

---

## 🔤 10 TypeScript Document Interfaces (`src/types/firestore.types.ts`)

```typescript
import { Timestamp } from 'firebase/firestore';

// 1. Users Document (/users/{userId})
export interface UserDocument {
  uid: string;
  name: string;
  handle: string;
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

// 2. Posts Document (/posts/{postId})
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

// 3. Comments Document (/posts/{postId}/comments/{commentId})
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

// 4. Likes Document (/likes/{likeId})
export interface LikeDocument {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  createdAtTimestamp: number;
  createdAt?: Timestamp;
}

// 5. Bookmarks Document (/users/{userId}/bookmarks/{postId})
export interface BookmarkDocument {
  id: string;
  userId: string;
  postId: string;
  createdAtTimestamp: number;
  createdAt?: Timestamp;
}

// 6. Followers Document (/users/{userId}/followers/{followerId})
export interface FollowerDocument {
  userId: string;
  followerId: string;
  followerName: string;
  followerAvatarUrl: string;
  createdAtTimestamp: number;
  createdAt?: Timestamp;
}

// 7. Following Document (/users/{userId}/following/{targetId})
export interface FollowingDocument {
  userId: string;
  targetUserId: string;
  targetName: string;
  targetAvatarUrl: string;
  createdAtTimestamp: number;
  createdAt?: Timestamp;
}

// 8. Notifications Document (/notifications/{notificationId})
export interface NotificationDocument {
  id: string;
  recipientId: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl: string;
  type: 'like' | 'comment' | 'follow' | 'save' | 'challenge' | 'system';
  actionText: string;
  postId?: string;
  isRead: boolean;
  createdAtTimestamp: number;
  createdAt?: Timestamp;
}

// 9. Stories Document (/stories/{storyId})
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

// 10. Reports Document (/reports/{reportId})
export interface ReportDocument {
  id: string;
  contentId: string;
  contentType: 'post' | 'comment' | 'user';
  reportedByUserId: string;
  reason: string;
  details?: string;
  status: 'pending' | 'reviewed' | 'actioned' | 'dismissed';
  createdAtTimestamp: number;
  createdAt?: Timestamp;
}
```

---

## 🔒 Security Rules (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    function isOwner(userId) { return isAuthenticated() && request.auth.uid == userId; }

    match /users/{userId} {
      allow read: if true;
      allow create, delete: if isOwner(userId);
      allow update: if isOwner(userId) || (isAuthenticated() && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['followersCount', 'followingCount']));
    }

    match /posts/{postId} {
      allow read: if true;
      allow create: if isAuthenticated() && request.resource.data.authorId == request.auth.uid;
      allow update: if isAuthenticated();
      allow delete: if isAuthenticated() && resource.data.authorId == request.auth.uid;
    }

    match /notifications/{notificationId} {
      allow read, update, delete: if isAuthenticated() && resource.data.recipientId == request.auth.uid;
      allow create: if isAuthenticated();
    }

    match /reports/{reportId} {
      allow create: if isAuthenticated() && request.resource.data.reportedByUserId == request.auth.uid;
      allow read, update, delete: if false; // Admin SDK access only
    }
  }
}
```

---

## ⚡ Composite Indexes (`firestore.indexes.json`)

```json
{
  "indexes": [
    {
      "collectionGroup": "posts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "createdAtTimestamp", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "posts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "trendingScore", "order": "DESCENDING" },
        { "fieldPath": "createdAtTimestamp", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "notifications",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "recipientId", "order": "ASCENDING" },
        { "fieldPath": "createdAtTimestamp", "order": "DESCENDING" }
      ]
    }
  ]
}
```
