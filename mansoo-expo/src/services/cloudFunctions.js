import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../../firebase'; // adjust path if needed

// Initialize Functions instance
export const functions = getFunctions(app);

/**
 * Wrapper to call a Firebase Callable function.
 * @param {string} name - Callable function name.
 * @param {any} data - Payload to send.
 * @returns {Promise<any>} Result data from the function.
 */
export const callFunction = async (name, data) => {
  try {
    const fn = httpsCallable(functions, name);
    const result = await fn(data);
    return result.data;
  } catch (e) {
    console.warn(`Callable function ${name} error:`, e);
    throw e;
  }
};

// Specific wrapper functions
export const createPost = async (postData) => {
  return await callFunction('createPost', postData);
};

export const reportContent = async (reportData) => {
  return await callFunction('reportContent', reportData);
};
