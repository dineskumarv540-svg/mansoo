// Feed Memory & Offline Cache Service
import { DUMMY_POSTS } from '../data/dummyData';

let MEMORY_FEED_CACHE = [...DUMMY_POSTS];

export function getCachedFeed() {
  return MEMORY_FEED_CACHE;
}

export function updateCachedFeed(newPosts) {
  MEMORY_FEED_CACHE = newPosts;
}

export function prependPostToCache(post) {
  MEMORY_FEED_CACHE = [post, ...MEMORY_FEED_CACHE];
}

export function updatePostInCache(postId, updatedFields) {
  MEMORY_FEED_CACHE = MEMORY_FEED_CACHE.map(post => {
    if (post.id === postId) {
      return { ...post, ...updatedFields };
    }
    return post;
  });
}
