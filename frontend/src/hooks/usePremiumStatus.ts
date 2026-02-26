import { useState, useEffect, useCallback } from 'react';

const PREMIUM_KEY = 'isPremium';
const PREMIUM_ACTIVATED_AT_KEY = 'premiumActivatedAt';
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export interface PremiumStatusResult {
  isActive: boolean;
  expiryDate: Date | null;
  activationDate: Date | null;
  checkAndEnforceExpiry: () => boolean;
}

export function usePremiumStatus(): PremiumStatusResult {
  const [isActive, setIsActive] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [activationDate, setActivationDate] = useState<Date | null>(null);

  const checkAndEnforceExpiry = useCallback((): boolean => {
    const premiumFlag = localStorage.getItem(PREMIUM_KEY);
    const activatedAt = localStorage.getItem(PREMIUM_ACTIVATED_AT_KEY);

    if (!premiumFlag || premiumFlag !== 'true') {
      setIsActive(false);
      setExpiryDate(null);
      setActivationDate(null);
      return false;
    }

    if (!activatedAt) {
      // Premium set but no timestamp — treat as expired/invalid
      localStorage.removeItem(PREMIUM_KEY);
      setIsActive(false);
      setExpiryDate(null);
      setActivationDate(null);
      return false;
    }

    const activationTime = parseInt(activatedAt, 10);
    if (isNaN(activationTime)) {
      localStorage.removeItem(PREMIUM_KEY);
      localStorage.removeItem(PREMIUM_ACTIVATED_AT_KEY);
      setIsActive(false);
      setExpiryDate(null);
      setActivationDate(null);
      return false;
    }

    const now = Date.now();
    const expiry = activationTime + ONE_YEAR_MS;

    if (now > expiry) {
      // Expired — clear premium
      localStorage.removeItem(PREMIUM_KEY);
      localStorage.removeItem(PREMIUM_ACTIVATED_AT_KEY);
      setIsActive(false);
      setExpiryDate(new Date(expiry));
      setActivationDate(new Date(activationTime));
      return false;
    }

    setIsActive(true);
    setExpiryDate(new Date(expiry));
    setActivationDate(new Date(activationTime));
    return true;
  }, []);

  useEffect(() => {
    checkAndEnforceExpiry();
  }, [checkAndEnforceExpiry]);

  return { isActive, expiryDate, activationDate, checkAndEnforceExpiry };
}
