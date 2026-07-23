// Notification Dispatcher Service for Firestore & Push Notifications
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { sendPushNotification } from './pushNotificationService';

/**
 * Trigger a Notification Document & FCM Push Alert
 */
export async function triggerNotification({
  recipientId,
  senderId,
  senderName,
  senderAvatarUrl,
  type,
  actionText,
  postId
}) {
  if (!recipientId || recipientId === senderId) return; // Don't notify self

  const notificationDoc = {
    recipientId,
    senderId,
    senderName,
    senderAvatarUrl,
    type,
    actionText,
    postId: postId || '',
    isRead: false,
    createdAtTimestamp: Date.now(),
  };

  try {
    await addDoc(collection(db, 'notifications'), notificationDoc);
    console.log(`[NotificationService] Notification triggered for ${recipientId}:`, actionText);
    sendPushNotification('fcm_token_placeholder', senderName, actionText, { postId });
  } catch (error) {
    console.log('[NotificationService] Local fallback notification dispatch:', error.message);
  }
}
