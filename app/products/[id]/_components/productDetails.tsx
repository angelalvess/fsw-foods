'use client'

import {
  formatCurrency,
  calculateProductTotalPrice,
} from '@/app/_helpers/price'
import { Prisma } from '@prisma/client'
import Image from 'next/image'
import DiscountBadge from '@/app/_components/discountBadge'
import { Button } from '@/app/_components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useContext, useState } from 'react'
import ProductList from '@/app/_components/productList'
import DeliveryInfo from '@/app/_components/deliveryInfo'
import { CartContext } from '@/app/_context/cart'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/app/_components/ui/sheet'
import Cart from '@/app/_components/cart'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/_components/ui/alert-dialog'

interface ProductDetailsProps {
  product: Prisma.ProductGetPayload<{
    include: {
      restaurant: true
    }
  }>
  complementaryProducts: Prisma.ProductGetPayload<{
    include: {
      restaurant: true
    }
  }>[]
}

const ProductDetails = ({
  product,
  complementaryProducts,
}: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { addProductToCart, products } = useContext(CartContext)
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false)

  console.log(products)

  const addToCart = ({ emptyCart }: { emptyCart?: boolean }) => {
    addProductToCart({ product: { ...product, quantity }, emptyCart })
    setIsCartOpen(true)
  }

  const handleAddToCartClick = () => {
    const hasDiferentRestaurantProduct = products.some(
      (cartProduct) => cartProduct.restaurantId !== product.restaurantId,
    )

    if (hasDiferentRestaurantProduct) {
      return setIsConfirmationDialogOpen(true)
    }

    addToCart({ emptyCart: false })
  }

  const handleIncreaseQuantity = () => {
    setQuantity((currentState) => currentState + 1)
  }

  const handleDecreaseQuantity = () => {
    setQuantity((currantState) => {
      if (currantState === 1) return 1

      return currantState - 1
    })
  }

  return (
    <>
      <div className="relative z-50 mt-[-1.5rem] rounded-tl-3xl rounded-tr-3xl bg-white py-5">
        <div className="flex items-center gap-[0.375rem] px-5">
          <div className="relative h-6 w-6">
            <Image
              src={product.restaurant.imageUrl}
              alt={product.restaurant.name}
              className="rounded-full object-cover"
              fill
            />
          </div>

          <span className="text-xs text-muted-foreground">
            {product.restaurant.name}
          </span>
        </div>

        <h1 className="mb-2 mt-1 px-5 text-xl font-semibold">{product.name}</h1>

        <div className="flex justify-between px-5">
          <div>
            <div className=" flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                {formatCurrency(calculateProductTotalPrice(product))}
              </h2>
              {product.discountPercentage > 0 && (
                <DiscountBadge product={product} />
              )}
            </div>
            {product.discountPercentage > 0 && (
              <p className="text-sm text-muted-foreground line-through">
                De: {formatCurrency(Number(product.price))}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 text-center">
            <Button
              onClick={handleDecreaseQuantity}
              size="icon"
              variant="ghost"
              className=" border border-solid border-muted-foreground"
            >
              <ChevronLeftIcon />
            </Button>
            <span className="w-4">{quantity}</span>

            <Button onClick={handleIncreaseQuantity} size="icon">
              <ChevronRightIcon />
            </Button>
          </div>
        </div>

        <div className="px-5">
          <DeliveryInfo restaurant={product.restaurant} />
        </div>

        <div className="mt-6 space-y-3 px-5">
          <h3 className="font-semibold">Sobre</h3>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>

        <div className="mt-6 space-y-3 ">
          <h3 className="px-5 font-semibold">Sucos</h3>
          <ProductList products={complementaryProducts} />
        </div>

        <div className="mt-6 px-5">
          <Button
            onClick={handleAddToCartClick}
            className="w-full font-semibold"
          >
            Adicionar a Sacola
          </Button>
        </div>
      </div>

      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-[90vw]">
          <SheetHeader>
            <SheetTitle className="text-left">Sacola</SheetTitle>
          </SheetHeader>

          <Cart setIsOpen={setIsCartOpen} />
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={isConfirmationDialogOpen}
        onOpenChange={setIsConfirmationDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Você só pode adicionar produtos de um restaurante por vez
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Se você adicionar este produto, os produtos do outro restaurante
            serão removidos da sacola. Deseja continuar?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => addToCart({ emptyCart: true })}>
              Adicionar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default ProductDetails
