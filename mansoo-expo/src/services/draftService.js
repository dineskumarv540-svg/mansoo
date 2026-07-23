// Local Drafts & Autosave Service for Post Creator
let DRAFT_STORAGE = null;

export function saveDraftLocally(draftData) {
  DRAFT_STORAGE = {
    ...draftData,
    savedAtTimestamp: Date.now(),
  };
  console.log('[DraftService] Draft saved locally:', DRAFT_STORAGE.savedAtTimestamp);
  return { success: true, savedAt: new Date().toLocaleTimeString() };
}

export function loadDraftLocally() {
  return DRAFT_STORAGE;
}

export function clearDraftLocally() {
  DRAFT_STORAGE = null;
}
