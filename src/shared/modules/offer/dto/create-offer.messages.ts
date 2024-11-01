export const CREATE_OFFER_VALIDATION_MESSAGE = {
  TITLE: {
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
  },
  DESCRIPTION: {
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  CITY: {
    invalid: 'City field must be one of the six cities',
  },
  OFFER_TYPE: {
    invalid: 'Offer type must be one of the four types',
  },
  FLAT_COUNT: {
    invalidFormat: 'Flat count must be an integer',
    minValue: 'Minimum flat count value must be 1',
    maxValue: 'Maximum flat count value must be 8',
  },
  GUEST_COUNT: {
    invalidFormat: 'Guest count must be an integer',
    minValue: 'Minimum guest count value must be 1',
    maxValue: 'Maximum guest count value must be 10',
  },
  COST: {
    invalidFormat: 'Cost must be an integer',
    minValue: 'Minimum cost is 100',
    maxValue: 'Maximum cost is 100000',
  },
  // TODO: Указываем только 6 фотографий
  IMAGES: {
    maxLength: 'Too short for field «image»',
  },
  CONVENIENCES: {
    invalidFormat: 'Field conveniences must be an array',
    invalid: 'Conveniences field must be an array of valid type',
  },


  AUTHOR: {
    invalidId: 'Author field must be a valid id',
  },
  PUBLICATION_DATE: {
    invalidFormat: 'postDate must be a valid ISO date',
  },
} as const;
