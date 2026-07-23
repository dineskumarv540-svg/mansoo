// Complete Draft Management Data Service (Firebase Sync + Local Memory Storage)
import { collection, doc, setDoc, getDocs, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

let ACTIVE_DRAFTS = [
  {
    id: 'draft_101',
    quoteText: 'Thoughts left unsaid under the starlight night...',
    category: 'Poem',
    fontStyle: 'Cursive',
    textColor: '#FFFFFF',
    backgroundColor: '#0F3D3E',
    status: 'Synced', // 'Synced' | 'Local'
    updatedAtTimestamp: Date.now() - 3600000,
    updatedAtText: '1h ago',
  },
  {
    id: 'draft_102',
    quoteText: 'Khwabon me mile the jinse, wo haqeeqat me door nikle...',
    category: 'Shayari',
    fontStyle: 'Serif',
    textColor: '#FFD54F',
    backgroundColor: '#1A1A2E',
    status: 'Local',
    updatedAtTimestamp: Date.now() - 7200000,
    updatedAtText: '2h ago',
  }
];

let TRASH_DRAFTS = [];

/**
 * Save or update a draft (Syncs to Firestore & Local Storage)
 */
export async function saveDraftLocally(draftData) {
  const id = draftData.id || 'draft_' + Date.now();
  const now = Date.now();
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const draftObj = {
    id,
    quoteText: draftData.quoteText || '',
    category: draftData.selectedCategory || draftData.category || 'Quotes',
    fontStyle: draftData.fontFamilyStyle || draftData.fontStyle || 'Serif',
    textColor: draftData.selectedTextColor || draftData.textColor || '#FFFFFF',
    backgroundImageUrl: draftData.selectedBgUrl || draftData.backgroundImageUrl || '',
    backgroundColor: draftData.selectedBgColor || draftData.backgroundColor || '#0F3D3E',
    status: 'Synced',
    updatedAtTimestamp: now,
    updatedAtText: timeStr,
  };

  // Update memory list
  const existingIdx = ACTIVE_DRAFTS.findIndex(d => d.id === id);
  if (existingIdx >= 0) {
    ACTIVE_DRAFTS[existingIdx] = draftObj;
  } else {
    ACTIVE_DRAFTS.unshift(draftObj);
  }

  // Firestore background sync
  try {
    const draftRef = doc(db, 'users', 'u1', 'drafts', id);
    await setDoc(draftRef, draftObj);
  } catch (error) {
    console.log('[DraftService] Draft saved in offline mode:', id);
    draftObj.status = 'Local';
  }

  return { success: true, savedAt: timeStr, draft: draftObj };
}

/**
 * Fetch all active drafts
 */
export async function fetchUserDrafts(userId = 'u1') {
  try {
    const draftsRef = collection(db, 'users', userId, 'drafts');
    const snapshot = await getDocs(query(draftsRef, orderBy('updatedAtTimestamp', 'desc')));
    if (!snapshot.empty) {
      const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      ACTIVE_DRAFTS = fetched;
    }
  } catch (e) {}

  return ACTIVE_DRAFTS;
}

/**
 * Load single draft
 */
export function loadDraftLocally() {
  return ACTIVE_DRAFTS.length > 0 ? ACTIVE_DRAFTS[0] : null;
}

/**
 * Move draft to Trash (Delete)
 */
export async function deleteDraft(draftId) {
  const target = ACTIVE_DRAFTS.find(d => d.id === draftId);
  if (target) {
    ACTIVE_DRAFTS = ACTIVE_DRAFTS.filter(d => d.id !== draftId);
    TRASH_DRAFTS.unshift({ ...target, deletedAtTimestamp: Date.now() });

    try {
      const draftRef = doc(db, 'users', 'u1', 'drafts', draftId);
      await deleteDoc(draftRef);
    } catch (e) {}
  }
  return { success: true };
}

/**
 * Restore draft from Trash
 */
export async function restoreDraft(draftId) {
  const target = TRASH_DRAFTS.find(d => d.id === draftId);
  if (target) {
    TRASH_DRAFTS = TRASH_DRAFTS.filter(d => d.id !== draftId);
    delete target.deletedAtTimestamp;
    ACTIVE_DRAFTS.unshift(target);
    await saveDraftLocally(target);
  }
  return { success: true };
}

/**
 * Get Trash items
 */
export function getTrashDrafts() {
  return TRASH_DRAFTS;
}

export function clearDraftLocally() {
  ACTIVE_DRAFTS = [];
}
