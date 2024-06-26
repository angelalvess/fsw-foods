'use client'
import { Restaurant, UserFavoriteRestaurant } from '@prisma/client'
import { Button } from '@/app/_components/ui/button'
import { ChevronLeftIcon, HeartIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import UseToggleFavoriteRestaurant from '@/app/_hooks/useToggleFavoriteRestaurant'

import { useSession } from 'next-auth/react'
import { isRestaurantFavorited } from '@/app/_helpers/restaurant'

interface RestaurantImageProps {
  restaurant: Pick<Restaurant, 'id' | 'imageUrl' | 'name'>
  userFavoriteRestaurants: UserFavoriteRestaurant[]
}

const RestaurantImage = ({
  restaurant,
  userFavoriteRestaurants,
}: RestaurantImageProps) => {
  const { data } = useSession()
  const router = useRouter()

  const isFavorite = isRestaurantFavorited(
    restaurant.id,
    userFavoriteRestaurants,
  )

  const { handleFavoriteClick } = UseToggleFavoriteRestaurant({
    restaurantId: restaurant.id,
    userId: data?.user?.id,
    restaurantIsFavorited: isFavorite,
  })

  const handleBackClick = () => {
    router.back()
  }

  return (
    <div className="relative h-[250px] w-full">
      <Image
        src={restaurant.imageUrl}
        alt={restaurant.name}
        fill
        className="object-cover"
        sizes="100%"
      />

      <Button
        onClick={handleBackClick}
        className="absolute left-4 top-4 rounded-full bg-white text-foreground hover:text-white"
        size="icon"
      >
        <ChevronLeftIcon />
      </Button>

      <Button
        size="icon"
        className={`absolute right-4 top-4 rounded-full bg-gray-700 ${isFavorite && 'bg-primary hover:bg-gray-700'}`}
      >
        <HeartIcon
          size={20}
          className="fill-white"
          onClick={handleFavoriteClick}
        />
      </Button>
    </div>
  )
}

export default RestaurantImage
