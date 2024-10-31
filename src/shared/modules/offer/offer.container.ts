
import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { OfferService } from './offer-service.interface.js';
import { DefaultOfferService } from './default-offer.service.js';
import { COMPONENT } from '../../constants/index.js';
import { Controller } from '../../libs/rest/index.js';
import { OfferController } from './offer.controller.js';
import { OfferEntity, OfferModel } from '../../entities/index.js';

export function createOfferContainer() {
  const offerContainer = new Container();

  offerContainer.bind<OfferService>(COMPONENT.OFFER_SERVICE).to(DefaultOfferService).inSingletonScope();
  offerContainer.bind<types.ModelType<OfferEntity>>(COMPONENT.OFFER_MODEL).toConstantValue(OfferModel);
  offerContainer.bind<Controller>(COMPONENT.OFFER_CONTROLLER).to(OfferController).inSingletonScope();

  return offerContainer;
}
