'use client'

import Image from 'next/image'
import { CartContext, CartProduct } from '../_context/cart'
import { calculateProductTotalPrice, formatCurrency } from '../_helpers/price'
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from 'lucide-react'
import { Button } from './ui/button'
import { useContext } from 'react'

interface CartItemProps {
  cartProduct: CartProduct
}

const CartItem = ({ cartProduct }: CartItemProps) => {
  const { decreaseProductQuantity } = useContext(CartContext)
  const { increaseProductQuantity } = useContext(CartContext)
  const { removeProductFromCart } = useContext(CartContext)

  const handleRemoveProductFromCart = () => {
    if (removeProductFromCart) {
      removeProductFromCart(cartProduct.id)
    }
  }

  const handleDecreaseProductQuantity = () => {
    if (decreaseProductQuantity) {
      decreaseProductQuantity(cartProduct.id)
    }
  }

  const handleIncreaseProductQuantity = () => {
    if (increaseProductQuantity) {
      increaseProductQuantity(cartProduct.id)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex  items-center gap-4">
        <div className="relative h-20 w-20 ">
          <Image
            src={cartProduct.imageUrl}
            alt={cartProduct.name}
            fill
            className="rounded-lg object-cover"
            sizes="100%"
          />
        </div>

        <div className="space-y-q">
          <h3 className="text-xs font-semibold">{cartProduct.name}</h3>

          <div className="gap-q flex items-center gap-1">
            <h4 className="font-semibold">
              {formatCurrency(
                calculateProductTotalPrice(cartProduct) * cartProduct.quantity,
              )}
            </h4>
            {cartProduct.discountPercentage > 0 && (
              <p className="text-sm text-muted-foreground line-through">
                {formatCurrency(
                  Number(cartProduct.price) * cartProduct.quantity,
                )}
              </p>
            )}
          </div>

          <div className="flex items-center  text-center">
            <Button
              size="icon"
              variant="ghost"
              className=" h-7 w-7 border border-solid border-muted-foreground"
            >
              <ChevronLeftIcon
                size={16}
                onClick={handleDecreaseProductQuantity}
              />
            </Button>
            <span className=" block w-8 text-xs">{cartProduct.quantity}</span>

            <Button size="icon" className=" h-7 w-7">
              <ChevronRightIcon
                size={16}
                onClick={handleIncreaseProductQuantity}
              />
            </Button>
          </div>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 border border-solid border-muted-foreground"
          onClick={handleRemoveProductFromCart}
        >
          <TrashIcon size={18} />
        </Button>
      </div>
    </div>
  )
}

export default CartItem
