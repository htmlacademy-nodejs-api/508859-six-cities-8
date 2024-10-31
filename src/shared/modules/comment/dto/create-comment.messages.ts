export const CREATE_COMMENT_MESSAGES = {
  TEXT: {
    invalidFormat: 'Text is required',
    lengthField: 'Min length is 5, max is 2024'
  },
  RATING: {
    invalidFormat: 'Rating must be an integer',
    minValue: 'Minimum rating value must be 1',
    maxValue: 'Maximum rating value must be 5',
  },
  OFFER_ID: {
    invalidFormat: 'OfferId field must be a valid id'
  },
  USER_ID: {
    invalidFormat: 'UserId field must be a valid id'
  },
} as const;
