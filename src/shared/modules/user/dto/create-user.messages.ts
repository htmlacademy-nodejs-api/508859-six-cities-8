export const CREATE_USER_MESSAGES = {
  EMAIL: {
    invalidFormat: 'Email must be a valid address'
  },
  AVATAR_PATH: {
    invalidFormat: 'Avatar path is required',
  },
  USERNAME: {
    invalidFormat: 'Username is required',
    lengthField: 'Min length is 1, max is 15',
  },
  PASSWORD: {
    invalidFormat: 'Password is required',
    lengthField: 'Min length for password is 6, max is 12'
  },
  USER_TYPE: {
    invalid: 'User type must be one of the two types: "pro" or "обычный"',
  }
} as const;
