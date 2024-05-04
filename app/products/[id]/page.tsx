import { db } from '@/app/_lib/prisma'
import { notFound } from 'next/navigation'
import ProductImage from './_components/productImage'
import ProductDetails from './_components/productDetails'

interface ProductPageProps {
  params: {
    id: string
  }
}

const ProductPage = async ({ params: { id } }: ProductPageProps) => {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      restaurant: true,
    },
  })

  if (!product) {
    return notFound()
  }

  const juices = await db.product.findMany({
    where: {
      category: {
        name: 'Sucos',
      },
      restaurant: {
        id: product.restaurant.id,
      },
    },
    include: {
      restaurant: true,
    },
  })

  return (
    <div>
      <ProductImage product={product} />
      <ProductDetails product={product} complementaryProducts={juices} />
    </div>
  )
}

export default ProductPage
