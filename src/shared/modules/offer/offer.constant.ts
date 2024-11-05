export const DEFAULT_OFFER_COUNT = 60;
export const MAX_PREMIUM_OFFER_COUNT = 3;
export const MAX_OFFER_COUNT = 300;
export const MAX_NUM_AFTER_DIGIT = 2;

export const OFFER_DTO_CONSTRAINTS = {
  TITLE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 100
  },
  DESCRIPTION: {
    MIN_LENGTH: 20,
    MAX_LENGTH: 1024
  },
  FLAT_COUNT: {
    MIN_VALUE: 1,
    MAX_VALUE: 8,
  },
  GUEST_COUNT: {
    MIN_VALUE: 1,
    MAX_VALUE: 10,
  },
  COST: {
    MIN_VALUE: 100,
    MAX_VALUE: 100000
  },
  IMAGE: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 6
  }
} as const;

