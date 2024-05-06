'use client'

import { Product } from '@prisma/client'
import { Button } from '@/app/_components/ui/button'
import { ChevronLeftIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface ProductImageProps {
  product: Pick<Product, 'imageUrl' | 'name'>
}

const ProductImage = ({ product }: ProductImageProps) => {
  const router = useRouter()

  const handleBackClick = () => {
    router.back()
  }

  return (
    <div className="relative h-[360px] w-full">
      <Image
        src={product.imageUrl}
        alt={product.name}
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
    </div>
  )
}

export default ProductImage
