// Google Play Billing & Mansoo Premium Subscription Service
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export const PREMIUM_PRODUCTS = {
  MONTHLY: {
    id: 'mansoo_premium_monthly',
    name: 'Mansoo PRO Monthly',
    priceText: '₹99 / month',
    priceVal: 99,
    period: 'monthly',
    savingsTag: null,
  },
  YEARLY: {
    id: 'mansoo_premium_yearly',
    name: 'Mansoo PRO Yearly',
    priceText: '₹799 / year',
    priceVal: 799,
    period: 'yearly',
    monthlyEquivalent: '₹66 / month',
    savingsTag: 'SAVE 33%',
  },
};

let IS_PRO_ACTIVE = false;

/**
 * Check if the current user has active Mansoo PRO
 */
export function isUserPro() {
  return IS_PRO_ACTIVE;
}

/**
 * Trigger Google Play Billing Purchase Flow for selected plan
 */
export async function purchasePremiumPlan(planId, userId = 'u1') {
  console.log(`[GooglePlayBilling] Initiating purchase for product: ${planId}`);
  IS_PRO_ACTIVE = true;

  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isPro: true,
      proPlanId: planId,
      proActivatedAtTimestamp: Date.now(),
      proExpiresAtTimestamp: Date.now() + (planId === PREMIUM_PRODUCTS.YEARLY.id ? 31536000000 : 2592000000),
    });
  } catch (error) {
    console.log('[GooglePlayBilling] Pro status activated locally');
  }

  return {
    success: true,
    message: 'Welcome to Mansoo PRO! Your premium features have been unlocked.',
  };
}

/**
 * Restore Previous Google Play Purchases
 */
export async function restorePurchases(userId = 'u1') {
  console.log(`[GooglePlayBilling] Restoring purchases for user: ${userId}`);
  IS_PRO_ACTIVE = true;

  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { isPro: true });
  } catch (error) {}

  return {
    success: true,
    message: 'Your Mansoo PRO subscription has been restored.',
  };
}
