/**
 * Production Crash Reporting & Error Logging Service for Mansoo
 */

export const crashService = {
  /**
   * Record a non-fatal error
   * @param {Error} error
   * @param {string} context
   */
  logError: (error, context = '') => {
    try {
      console.error(`[Crashlytics/Error] ${context}:`, error);
      // Integration hook for Crashlytics / Sentry:
      // recordError(error);
    } catch (e) {
      console.warn('[CrashService Fail]', e);
    }
  },

  /**
   * Log custom diagnostic attribute
   * @param {string} key
   * @param {string|number} value
   */
  setAttribute: (key, value) => {
    try {
      console.log(`[Crashlytics] Attribute: ${key} = ${value}`);
    } catch (e) {
      console.warn('[CrashService Fail]', e);
    }
  },
};
