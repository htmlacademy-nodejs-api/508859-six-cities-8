import { UpdateOfferDTO } from '../../dto/offer/update-offer.dto';
import { Offer } from '../../types/types';

export const adaptEditOfferToServer =
  (offer: Offer): UpdateOfferDTO => ({
    title: offer.title,
    description: offer.description,
    city: offer.city.name,
    previewImg: offer.previewImage,
    images: offer.images,
    isPremium: offer.isPremium,
    type: offer.type,
    flatCount: offer.bedrooms,
    guestCount: offer.maxAdults,
    cost: offer.price,
    conveniences: offer.goods,
    coordinate: offer.city.location,
  });
