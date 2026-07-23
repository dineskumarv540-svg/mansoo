import { useState, useEffect, useCallback } from 'react';
import {
  saveDraftLocally,
  fetchUserDrafts,
  deleteDraft,
  restoreDraft,
  getTrashDrafts
} from '../services/draftService';

export function useDrafts(userId = 'u1') {
  const [drafts, setDrafts] = useState([]);
  const [trashDrafts, setTrashDrafts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autosaveTime, setAutosaveTime] = useState('');

  const refreshDrafts = useCallback(async () => {
    setLoading(true);
    const active = await fetchUserDrafts(userId);
    const trash = getTrashDrafts();
    setDrafts([...active]);
    setTrashDrafts([...trash]);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refreshDrafts();
  }, [refreshDrafts]);

  const saveCurrentDraft = useCallback(async (draftData) => {
    const res = await saveDraftLocally(draftData);
    setAutosaveTime(res.savedAt);
    await refreshDrafts();
    return res;
  }, [refreshDrafts]);

  const removeDraft = useCallback(async (draftId) => {
    const res = await deleteDraft(draftId);
    await refreshDrafts();
    return res;
  }, [refreshDrafts]);

  const recoverDraft = useCallback(async (draftId) => {
    const res = await restoreDraft(draftId);
    await refreshDrafts();
    return res;
  }, [refreshDrafts]);

  return {
    drafts,
    trashDrafts,
    loading,
    autosaveTime,
    saveCurrentDraft,
    removeDraft,
    recoverDraft,
    refreshDrafts,
  };
}
