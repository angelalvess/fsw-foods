import { UserFavoriteRestaurant } from '@prisma/client'

export const isRestaurantFavorited = (
  restaurantId: string,
  userFavoriteRestaunts: UserFavoriteRestaurant[],
) => userFavoriteRestaunts.some((fav) => fav.restaurantId === restaurantId)
