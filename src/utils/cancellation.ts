import { PRICE_DISCOUNTS, MIN_FEEDBACK_LENGTH } from '@/constants/cancellation';

export const getDownsellPrice = (monthlyPrice: number): number => {
  const originalPrice = monthlyPrice / 100; // Convert cents to dollars
  
  if (originalPrice in PRICE_DISCOUNTS) {
    return PRICE_DISCOUNTS[originalPrice as keyof typeof PRICE_DISCOUNTS];
  }
  
  return Math.round(originalPrice * 0.6); // 40% off fallback
};

export const calculateVariantFromUserId = (userId: string): 'A' | 'B' => {
  // Generate deterministic variant based on user ID
  const hash = userId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a; // Convert to 32-bit integer
  }, 0);
  
  return Math.abs(hash) % 2 === 0 ? 'A' : 'B';
};

export const isReasonFollowUpComplete = (
  reason: string | null, 
  followUpText: string
): boolean => {
  if (!reason) return false;
  
  if (reason === 'Too expensive') {
    return followUpText.trim().length > 0; // Any amount entered
  } else {
    return followUpText.trim().length >= MIN_FEEDBACK_LENGTH;
  }
};

export const formatCurrency = (amount: number): string => {
  return `$${amount}`;
};
