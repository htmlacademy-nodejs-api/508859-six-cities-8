export const DEFAULT_COMMENT_COUNT = 50;

export const COMMENT_DTO_CONSTRAINTS = {
  TEXT: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 1024
  },
  RATING: {
    MIN_VALUE: 1,
    MAX_VALUE: 5
  },
} as const;
