import ProductItem from '@/app/_components/productItem'

import { db } from '@/app/_lib/prisma'

const RecomendedRequest = async () => {
  const products = await db.product.findMany({})

  return (
    <div>
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  )
}

export default RecomendedRequest
