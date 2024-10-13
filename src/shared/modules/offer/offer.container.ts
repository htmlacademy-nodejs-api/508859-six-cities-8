
import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { OfferService } from './offer-service.interface.js';
import { DefaultOfferService } from './default-offer.service.js';
import { OfferEntity, OfferModel } from './offer.entity.js';
import { COMPONENT } from '../../constants/index.js';

export function createOfferContainer() {
  const offerContainer = new Container();

  offerContainer.bind<OfferService>(COMPONENT.OFFER_SERVICE).to(DefaultOfferService);
  offerContainer.bind<types.ModelType<OfferEntity>>(COMPONENT.OFFER_MODEL).toConstantValue(OfferModel);

  return offerContainer;
}
