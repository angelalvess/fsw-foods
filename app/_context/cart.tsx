'use client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Prisma } from '@prisma/client'
import { ReactNode, createContext, useState } from 'react'
import { calculateProductTotalPrice } from '../_helpers/price'

export interface CartProduct
  extends Prisma.ProductGetPayload<{
    include: {
      restaurant: {
        select: {
          id: true
          deliveryFee: true
          deliveryTimeMinutes: true
        }
      }
    }
  }> {
  quantity: number
}

interface ICartContext {
  products: CartProduct[]
  calculateSubtotalPrice: number
  calculateTotalDiscounts: number
  calculateTotalPrice: number
  calculateTotalQuantity: number

  addProductToCart: ({
    product,

    emptyCart,
  }: {
    product: CartProduct
    emptyCart?: boolean
  }) => void
  decreaseProductQuantity?: (productId: string) => void
  increaseProductQuantity?: (productId: string) => void
  removeProductFromCart?: (productId: string) => void
  clearCart: () => void
}

export const CartContext = createContext<ICartContext>({
  products: [],
  calculateSubtotalPrice: 0,
  calculateTotalDiscounts: 0,
  calculateTotalPrice: 0,
  calculateTotalQuantity: 0,
  addProductToCart: () => {},
  decreaseProductQuantity: () => {},
  increaseProductQuantity: () => {},
  removeProductFromCart: () => {},
  clearCart: () => {},
})

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<CartProduct[]>([])

  const removeProductFromCart: ICartContext['removeProductFromCart'] = (
    productId: string,
  ) => {
    return setProducts((prev) =>
      prev.filter((cartProduct) => cartProduct.id !== productId),
    )
  }

  const calculateSubtotalPrice = products.reduce((acc, product) => {
    return acc + Number(product.price) * product.quantity
  }, 0)

  const calculateTotalPrice =
    products.reduce((acc, product) => {
      return acc + calculateProductTotalPrice(product) * product.quantity
    }, 0) + Number(products?.[0]?.restaurant?.deliveryFee)

  const calculateTotalQuantity = products.reduce((acc, product) => {
    return acc + product.quantity
  }, 0)

  const calculateTotalDiscounts = calculateSubtotalPrice - calculateTotalPrice

  const decreaseProductQuantity: ICartContext['decreaseProductQuantity'] = (
    productId: string,
  ) => {
    return setProducts((prev) =>
      prev.map((cartProduct) => {
        if (cartProduct.id === productId) {
          if (cartProduct.quantity === 1) {
            return cartProduct
          }
          return {
            ...cartProduct,
            quantity: cartProduct.quantity - 1,
          }
        }

        return cartProduct
      }),
    )
  }

  const increaseProductQuantity: ICartContext['increaseProductQuantity'] = (
    productId: string,
  ) => {
    return setProducts((prev) =>
      prev.map((cartProduct) => {
        if (cartProduct.id === productId) {
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + 1,
          }
        }

        return cartProduct
      }),
    )
  }

  const addProductToCart: ICartContext['addProductToCart'] = ({
    product,

    emptyCart,
  }) => {
    if (emptyCart) {
      setProducts([])
    }
    const isProductAlreadyOnCart = products.some(
      (cartProduct) => cartProduct.id === product.id,
    )

    if (isProductAlreadyOnCart) {
      return setProducts((prev) =>
        prev.map((cartProduct) => {
          if (cartProduct.id === product.id) {
            return {
              ...cartProduct,
              quantity: cartProduct.quantity + product.quantity,
            }
          }

          return cartProduct
        }),
      )
    }

    setProducts((prev) => [...prev, product])
  }

  const clearCart = () => {
    return setProducts([])
  }

  return (
    <CartContext.Provider
      value={{
        products,
        addProductToCart,
        decreaseProductQuantity,
        increaseProductQuantity,
        removeProductFromCart,
        calculateSubtotalPrice,
        calculateTotalPrice,
        calculateTotalDiscounts,
        calculateTotalQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
