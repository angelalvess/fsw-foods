import { getServerSession } from 'next-auth'
import { authOptions } from '../_lib/auth'
import { notFound } from 'next/navigation'
import { db } from '../_lib/prisma'
import Header from '../_components/header'
import RestaurantItem from '../_components/restaurantItem'

const myFavoriteRestaurantsPage = async () => {
  const session = await getServerSession(authOptions)

  if (!session) {
    return notFound()
  }

  const userFavoriteRestaurants = await db.userFavoriteRestaurant.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      restaurant: true,
    },
  })

  return (
    <>
      <Header />

      <div className="px-5 py-6 ">
        <h2 className="mb-6 text-lg font-semibold">Restaurantes Favoritos</h2>

        <div className="flex w-full flex-col gap-6 ">
          {userFavoriteRestaurants.length > 0 ? (
            userFavoriteRestaurants.map(({ restaurant }) => (
              <RestaurantItem
                key={restaurant.id}
                restaurant={restaurant}
                classname="min-w-full max-w-full"
                userFavoritesRestaurants={userFavoriteRestaurants}
              />
            ))
          ) : (
            <div className="flex h-[300px] w-full items-center justify-center">
              <p className="text-center text-lg">
                Você ainda não favoritou nenhum restaurante!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default myFavoriteRestaurantsPage
