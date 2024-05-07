import CategoryList from './_components/categoryList'
import Header from './_components/header'
import { Search } from './_components/search'
import ProductList from './_components/productList'
import { Button } from './_components/ui/button'
import { ChevronRightIcon } from 'lucide-react'
import { db } from './_lib/prisma'
import PromoBanner from './_components/promoBanner'
import RestaurantList from './_components/restaurantList'
import Link from 'next/link'

const fetch = async () => {
  const getProducts = await db.product.findMany({
    where: {
      discountPercentage: {
        gt: 0,
      },
    },
    take: 15,
    include: {
      restaurant: {
        select: {
          name: true,
        },
      },
    },
  })

  const getBurguerCategory = await db.category.findFirst({
    where: {
      name: 'Hambúrgueres',
    },
  })

  const getPizzaCategory = await db.category.findFirst({
    where: {
      name: 'Pizzas',
    },
  })

  const [products, burguerCategory, pizzaCategory] = await Promise.all([
    getProducts,
    getBurguerCategory,
    getPizzaCategory,
  ])

  return { products, burguerCategory, pizzaCategory }
}

const Home = async () => {
  const { products, burguerCategory, pizzaCategory } = await fetch()

  return (
    <>
      <Header />
      <div className="px-5 pt-6">
        <Search />
      </div>

      <div className="px-5 pt-6">
        <CategoryList />
      </div>

      <div className="pt-6">
        <Link href={`/categories/${pizzaCategory?.id}/products`}>
          <PromoBanner src="/promo-banner-01.png" alt="Promo banner 1" />
        </Link>
      </div>

      <div className="space-y-4 pt-6">
        <div className="flex items-center justify-between px-5">
          <h2 className="text-1xl font-semibold">Pedidos Recomendados</h2>

          <Button
            variant="ghost"
            className="h-fit p-0 text-primary hover:bg-transparent"
            asChild
          >
            <Link href="/products/recommended">
              Ver todos
              <ChevronRightIcon size={16} />
            </Link>
          </Button>
        </div>
        <ProductList products={products} />
      </div>

      <div className="px-6 pt-6">
        <Link href={`/categories/${burguerCategory?.id}/products`}>
          <PromoBanner src="/promo-banner-02.png" alt="Promo banner 2" />
        </Link>
      </div>

      <div className="space-y-4 py-6">
        <div className="flex items-center justify-between px-5">
          <h2 className="text-1xl font-semibold">Restaurantes Recomendados</h2>

          <Button
            variant="ghost"
            className="h-fit p-0 text-primary hover:bg-transparent"
            asChild
          >
            <Link href="/restaurants/recommended">
              Ver todos
              <ChevronRightIcon size={16} />
            </Link>
          </Button>
        </div>

        <RestaurantList />
      </div>
    </>
  )
}

export default Home
