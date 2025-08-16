export const MOCK_USER = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  email: 'user1@example.com'
};

export const MOCK_SUBSCRIPTION = {
  id: 'sub-123',
  user_id: MOCK_USER.id,
  monthly_price: 2500, // $25.00 in cents
  status: 'active'
};

export const SURVEY_OPTIONS = {
  roles: ['0', '1-5', '6-20', '20+'],
  companies: ['0', '1-5', '6-20', '20+'],
  interviews: ['0', '1-2', '3-5', '5+']
} as const;

export const PRICE_DISCOUNTS = {
  25: 15, // $25 → $15
  29: 19  // $29 → $19
} as const;

export const MIN_FEEDBACK_LENGTH = 25;

export const CANCELLATION_REASONS = [
  'Too expensive',
  'Platform not helpful',
  'Not enough relevant jobs',
  'Decided not to move',
  'Other'
] as const;
