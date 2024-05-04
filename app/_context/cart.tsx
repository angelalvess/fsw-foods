'use client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Product, Prisma } from '@prisma/client'
import { ReactNode, createContext, useMemo, useState } from 'react'
import { calculateProductTotalPrice } from '../_helpers/price'

export interface CartProduct
  extends Prisma.ProductGetPayload<{
    include: {
      restaurant: {
        select: {
          deliveryFee: true
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
  addProductToCart: (
    product: Prisma.ProductGetPayload<{
      include: {
        restaurant: {
          select: {
            deliveryFee: true
          }
        }
      }
    }>,
    quantity: number,
  ) => void
  decreaseProductQuantity?: (productId: string) => void
  increaseProductQuantity?: (productId: string) => void
  removeProductFromCart?: (productId: string) => void
}

export const CartContext = createContext<ICartContext>({
  products: [],
  addProductToCart: () => {},
  decreaseProductQuantity: () => {},
  increaseProductQuantity: () => {},
  removeProductFromCart: () => {},
  calculateSubtotalPrice: 0,
  calculateTotalDiscounts: 0,
  calculateTotalPrice: 0,
})

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<CartProduct[]>([])

  const calculateSubtotalPrice = useMemo(() => {
    return products.reduce((acc, product) => {
      return acc + Number(product.price) * product.quantity
    }, 0)
  }, [products])

  const calculateTotalPrice = useMemo(() => {
    return products.reduce((acc, product) => {
      return acc + calculateProductTotalPrice(product) * product.quantity
    }, 0)
  }, [products])

  const calculateTotalDiscounts = calculateSubtotalPrice - calculateTotalPrice

  const removeProductFromCart = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.filter((cartProduct) => cartProduct.id !== productId),
    )
  }

  const decreaseProductQuantity = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((cartProduct) => {
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

  const increaseProductQuantity = (productId: string) => {
    setProducts((prevProducts) =>
      prevProducts.map((cartProduct) => {
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

  const addProductToCart = (
    product: Prisma.ProductGetPayload<{
      include: {
        restaurant: {
          select: {
            deliveryFee: true
          }
        }
      }
    }>,
    quantity: number,
  ) => {
    const isProductAlreadyOnCart = products.some(
      (cartProduct) => cartProduct.id === product.id,
    )

    if (isProductAlreadyOnCart) {
      return setProducts((prevProducts) =>
        prevProducts.map((cartProduct) => {
          if (cartProduct.id === product.id) {
            return { ...cartProduct, quantity: cartProduct.quantity + quantity }
          }

          return cartProduct
        }),
      )
    }

    setProducts((prevProducts) => [...prevProducts, { ...product, quantity }])
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
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
