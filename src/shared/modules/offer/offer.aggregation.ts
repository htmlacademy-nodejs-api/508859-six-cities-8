import { SortType } from '../../types/sort-type.enum.js';
import { DEFAULT_COMMENT_COUNT } from '../comment/comment.constant.js';

// export const offerRatingAggregation = [
//     {
//       $lookup: {
//         // Коллекция к которой хотим присоединится
//         from: 'comments',
//         // Поле, к которому мы хотим присоединиться, в локальной коллекции (коллекции, к которой мы выполняем запрос)
//         localField: '_id',
//         // Поле, к которому мы хотим присоединиться, во внешней коллекции (коллекция, к которой мы хотим присоединиться)
//         foreignField: 'offerId',
//         let: { rating: '$_rating'},
//         pipeline: [
//           { $match: { $expr: { $eq: ['$$categoryId', '$categories'] } } },
//           { $project : { _id : 0, rating: 1 } },
//         ],
//         // Имя выходного массива для результатов
//         as: 'comments'
//       },
//     },
//     {
//       $set: {
//         avgRating: { $avg: '$ratings.rating' }
//       }
//     },
//     {
//       $unset: 'ratings'
//     }
// ];

export const populateAuthor = {
    $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'author',
    }
}

export const commentCountAggregation = [{
    $lookup: {
      from: 'comments',
      let: { offerId: '$_id'},
      pipeline: [
        // $eq - равно
        { $match: { $expr: { $eq: ['$offerId', '$$offerId'] } } },
        { $project: { _id: 1}}
      ],
      as: 'comments'
    },
  },
  { id: { $toString: '$_id'}, commentCount: { $size: '$comments' } },
  { $unset: 'comments' }
]

export const populateComments = [
    {
        $lookup: {
            from: 'comments',
            let: { offerId: '$_id'},
            pipeline: [
              { $match: { $expr: { $eq: ['$offerId', '$$offerId'] } } },
              { $project: { _id: 1, text: 1, rating: 1, createdAt: 1 }}
            ],
            as: 'comments'
          },
    },
    {
        $limit: DEFAULT_COMMENT_COUNT
    },
    {
        $sort: { createdAt: SortType.DOWN }
    }
];