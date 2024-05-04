import Header from '@/app/_components/header'
import ProductItem from '@/app/_components/productItem'
import { db } from '@/app/_lib/prisma'
import { notFound } from 'next/navigation'

interface CategoriePageProps {
  params: {
    id: string
  }
}

const CategoriePage = async ({ params: { id } }: CategoriePageProps) => {
  const category = await db.category.findUnique({
    where: {
      id,
    },
    include: {
      products: {
        include: {
          restaurant: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })

  if (!category) {
    return notFound()
  }

  return (
    <>
      <Header />

      <div className="px-5 py-6 ">
        <h2 className="mb-6 text-lg font-semibold">{category.name}</h2>

        <div className="grid grid-cols-2 gap-6 ">
          {category?.products.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              classname="min-w-full "
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default CategoriePage
