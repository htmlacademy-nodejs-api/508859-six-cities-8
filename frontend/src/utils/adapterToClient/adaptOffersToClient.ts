import { FullOfferDTO } from '../../dto/offer/full-offer.dto';
import { ShortOfferDTO } from '../../dto/offer/short-offer.dto';
import { Offer } from '../../types/types';
import { adaptUserToClient } from './adaptUserToClient';

export const adaptOffersToClient =
  (offers: FullOfferDTO[]): Offer[] => { 

    return offers.map((offer) => ({
        id: offer?.id,
        price: offer.cost,
        rating: offer?.rating,
        title: offer.title,
        isPremium: offer?.isPremium,
        isFavorite: offer?.isFavorite,
        city: {
            name: offer.city,
            location: offer.coordinate,
        },
        location: offer.coordinate,
        previewImage: offer.previewImg,
        type: offer.type,
        bedrooms: offer.flatCount,
        description: offer.description,
        goods: offer.conveniences,
        host: adaptUserToClient(offer?.user),
        images: offer?.images,
        maxAdults: offer.guestCount
    }));
}

export const adaptOfferToClient =
  (offer: FullOfferDTO): Offer => { 

    return ({
        id: offer?.id,
        price: offer.cost,
        rating: offer?.rating,
        title: offer.title,
        isPremium: offer?.isPremium,
        isFavorite: offer?.isFavorite,
        city: {
            name: offer.city,
            location: offer.coordinate,
        },
        location: offer.coordinate,
        previewImage: offer.previewImg,
        type: offer.type,
        bedrooms: offer.flatCount,
        description: offer.description,
        goods: offer.conveniences,
        host: adaptUserToClient(offer?.user),
        images: offer?.images,
        maxAdults: offer.guestCount
    });
}

