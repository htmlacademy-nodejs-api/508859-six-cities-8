export const favoritesAggregation = {
  $lookup: {
    from: 'offers',
    localField: 'favorites',
    foreignField: '_id',
    as: 'favorites'
  }
};
