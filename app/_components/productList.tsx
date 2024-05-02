import ProductItem from './productItem'
import { Prisma } from '@prisma/client'

interface ProductListProps {
  products: Prisma.ProductGetPayload<{
    include: {
      restaurant: {
        select: {
          name: true
        }
      }
    }
  }>[]
}

const ProductList = ({ products }: ProductListProps) => {
  return (
    <div className="bg-300 flex gap-4 overflow-x-scroll  px-5 [&::-webkit-scrollbar]:hidden">
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductList
