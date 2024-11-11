import { CreateOfferDTO } from '../../dto/offer/create-offer.dto';
import { NewOffer } from '../../types/types';

export const adaptCreateOfferToServer =
  (offer: NewOffer): CreateOfferDTO => ({
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
