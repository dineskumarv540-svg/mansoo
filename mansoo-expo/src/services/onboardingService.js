// First Launch & User Interest Storage Service
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

let HAS_COMPLETED_ONBOARDING = false;
let USER_INTERESTS = [];

/**
 * Check if the app is launching for the first time
 */
export async function checkIsFirstLaunch() {
  return !HAS_COMPLETED_ONBOARDING;
}

/**
 * Mark onboarding as completed
 */
export async function setOnboardingCompleted() {
  HAS_COMPLETED_ONBOARDING = true;
}

/**
 * Reset onboarding state (usable from Settings)
 */
export async function resetOnboarding() {
  HAS_COMPLETED_ONBOARDING = false;
}

/**
 * Save selected interest categories to Firestore & local cache
 */
export async function saveUserInterests(userId = 'u1', selectedInterests = []) {
  USER_INTERESTS = selectedInterests;
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      interests: selectedInterests,
      updatedAtTimestamp: Date.now(),
    });
    return { success: true };
  } catch (error) {
    console.log('[OnboardingService] Saved interests locally:', selectedInterests);
    return { success: true };
  }
}

export function getUserInterests() {
  return USER_INTERESTS;
}
