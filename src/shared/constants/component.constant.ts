export const COMPONENT = {
  REST_APPLICATION: Symbol.for('kRestApplication'),
  LOGGER: Symbol.for('kLogger'),
  CONFIG: Symbol.for('kConfig'),
  DATABASE_CLIENT: Symbol.for('kDatabaseClient'),
  USER_SERVICE: Symbol.for('kUserService'),
  USER_MODEL: Symbol.for('kUserModel'),
  OFFER_SERVICE: Symbol.for('kOfferService'),
  OFFER_MODEL: Symbol.for('kOfferModel'),
} as const;
