export const USER_DTO_CONSTRAINTS = {
    USERNAME: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 15
    },
    PASSWORD: {
      MIN_LENGTH: 6,
      MAX_LENGTH: 12
    },
} as const;
  