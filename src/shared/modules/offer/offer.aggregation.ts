import { Types } from 'mongoose';
import { MAX_NUM_AFTER_DIGIT } from './offer.constant.js';

export const favoriteAggregation = (userId: string, offerId: string = '') => {
  if (userId) {
    return [
      {
        $lookup: {
          from: 'users',
          pipeline: [
            { $match: { '_id': new Types.ObjectId(userId) } },
            { $project: { favorites: 1 } }
          ],
          as: 'user'
        },
      },
      { $unwind: '$user' },
      { $addFields: { isFavorite: {
        $in: [offerId ? new Types.ObjectId(offerId) : '$_id' , '$user.favorites']
      } }},
      { $unset: 'user' }
    ];
  }

  return [
    { $addFields: { isFavorite: false } },
  ];
};

export const commentAggregation = [
  {
    $lookup: {
      from: 'comments',
      let: { offerId: '$_id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$offerId', '$$offerId'] } } },
        { $project: { _id: 1, rating: 1 } },
      ],
      as: 'comments',
    }
  },
  { $addFields: { commentsCount: { $size: '$comments'} } },
  { $addFields: { commentRatingSum: {
    $reduce: {
      input: '$comments',
      initialValue: { sum: 0 },
      in: {
        sum: { $add: ['$$value.sum', '$$this.rating'] }
      }
    }
  } } },
  { $addFields: { rating: {
    $cond: {
      if: {
        $ne: ['$commentsCount', 0]
      },
      then: { $round: [{
        $divide: [
          '$commentRatingSum.sum',
          '$commentsCount'
        ]
      }, MAX_NUM_AFTER_DIGIT] },
      else: 0,
    }
  } } },
  { $unset: 'commentRatingSum' },
  { $unset: 'comments' },
];

export const authorAggregation = [{
  $lookup: {
    from: 'users',
    localField: 'userId',
    foreignField: '_id',
    as: 'user',
  },
}];

export const commentCountAggregation = [{
  $lookup: {
    from: 'comments',
    let: { offerId: '$_id'},
    pipeline: [
      { $match: { $expr: { $eq: ['$offerId', '$$offerId'] } } },
      { $project: { _id: 1}}
    ],
    as: 'comments'
  },
},
{ id: { $toString: '$_id'}, commentCount: { $size: '$comments' } },
{ $unset: 'comments' }
];
