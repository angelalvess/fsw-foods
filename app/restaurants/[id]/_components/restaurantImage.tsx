'use client'
import { Restaurant } from '@prisma/client'
import { Button } from '@/app/_components/ui/button'
import { ChevronLeftIcon, HeartIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface RestaurantImageProps {
  restaurant: Pick<Restaurant, 'imageUrl' | 'name'>
}

const RestaurantImage = ({ restaurant }: RestaurantImageProps) => {
  const router = useRouter()

  const handleBackClick = () => {
    router.back()
  }

  return (
    <div className="relative h-[215px] w-full">
      <Image
        src={restaurant.imageUrl}
        alt={restaurant.name}
        fill
        className="object-cover"
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
        className="absolute right-4 top-4  rounded-full bg-gray-700"
      >
        <HeartIcon size={20} className="fill-white" />
      </Button>
    </div>
  )
}

export default RestaurantImage
