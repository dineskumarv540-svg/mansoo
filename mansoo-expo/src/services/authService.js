// Complete Firebase Authentication Service
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  deleteUser,
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

/**
 * Login with Email & Password
 */
export async function loginWithEmail(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: formatAuthError(error.code) };
  }
}

/**
 * Sign Up with Email, Password & Display Name
 */
export async function signUpWithEmail(email, password, displayName) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = userCredential.user;

    // Update profile display name
    await updateProfile(user, { displayName: displayName.trim() });

    // Send verification email
    await sendEmailVerification(user);

    // Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: displayName.trim(),
      email: user.email,
      handle: `@${displayName.toLowerCase().replace(/\s+/g, '_')}`,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
      bio: 'Writing the language of the soul ✨',
      isVerified: false,
      isPro: false,
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      createdAt: Date.now(),
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: formatAuthError(error.code) };
  }
}

/**
 * Google Sign-In helper
 */
export async function loginWithGoogleCredential(idToken) {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const userCredential = await signInWithCredential(auth, credential);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: formatAuthError(error.code) };
  }
}

/**
 * Forgot Password — Send Password Reset Email
 */
export async function sendResetPasswordEmail(email) {
  try {
    await sendPasswordResetEmail(auth, email.trim());
    return { success: true, message: 'Password reset link sent to your email.' };
  } catch (error) {
    return { success: false, error: formatAuthError(error.code) };
  }
}

/**
 * Resend Email Verification
 */
export async function resendVerificationEmail() {
  try {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      return { success: true, message: 'Verification email resent.' };
    }
    return { success: false, error: 'No user signed in.' };
  } catch (error) {
    return { success: false, error: formatAuthError(error.code) };
  }
}

/**
 * Logout User
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete User Account & Profile
 */
export async function deleteUserAccount() {
  try {
    const user = auth.currentUser;
    if (user) {
      // Remove Firestore document
      await deleteDoc(doc(db, 'users', user.uid));
      // Delete Auth Account
      await deleteUser(user);
      return { success: true };
    }
    return { success: false, error: 'No user signed in.' };
  } catch (error) {
    return { success: false, error: 'Re-authentication required before deleting account.' };
  }
}

/**
 * Format Firebase Auth Error Codes into User-Friendly Messages
 */
function formatAuthError(code) {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet.';
    default:
      return 'Authentication failed. Please try again.';
  }
}
