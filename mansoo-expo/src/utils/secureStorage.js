import * as SecureStore from 'expo-secure-store';

/**
 * Wrapper around expo-secure-store for encrypted key-value storage.
 * All values are stored as strings. JSON.stringify / JSON.parse can be used by callers.
 */
export const secureStorage = {
  /**
   * Save a value securely.
   * @param {string} key - The key under which to store the value.
   * @param {string} value - The string value to store.
   */
  setItem: async (key, value) => {
    try {
      await SecureStore.setItemAsync(key, value, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED,
      });
      return true;
    } catch (e) {
      console.warn('SecureStore setItem error', e);
      return false;
    }
  },

  /**
   * Retrieve a stored value.
   * @param {string} key - The key to retrieve.
   * @returns {Promise<string|null>} The stored string or null if not found.
   */
  getItem: async (key) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (e) {
      console.warn('SecureStore getItem error', e);
      return null;
    }
  },

  /**
   * Delete a stored value.
   * @param {string} key - The key to delete.
   */
  deleteItem: async (key) => {
    try {
      await SecureStore.deleteItemAsync(key);
      return true;
    } catch (e) {
      console.warn('SecureStore deleteItem error', e);
      return false;
    }
  },
};
