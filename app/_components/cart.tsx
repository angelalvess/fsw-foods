import { useContext, useState } from 'react'
import { CartContext } from '../_context/cart'
import CartItem from './cartItem'
import { Card, CardContent } from './ui/card'
import { formatCurrency } from '../_helpers/price'
import { Separator } from './ui/separator'
import { Button } from './ui/button'
import { createOrder } from '../_actions/order'
import { OrderStatus } from '@prisma/client'

import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
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

const Cart = () => {
  const [isSubmitLoading, setIsSubmitLoading] = useState(false)
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] =
    useState(false)
  const { data } = useSession()

  const {
    products,
    calculateSubtotalPrice,
    calculateTotalDiscounts,
    calculateTotalPrice,
    clearCart,
  } = useContext(CartContext)

  const handleFinishOrder = async () => {
    if (!data?.user) return
    const restaurant = products[0].restaurant

    try {
      setIsSubmitLoading(true)

      await createOrder({
        subtotalPrice: calculateSubtotalPrice,
        totalPrice: calculateTotalPrice,
        totalDiscount: calculateTotalDiscounts,
        deliveryFee: restaurant.deliveryFee,
        deliveryTimeMinutes: restaurant.deliveryTimeMinutes,
        restaurant: {
          connect: {
            id: restaurant.id,
          },
        },
        status: OrderStatus.CONFIRMED,
        user: {
          connect: {
            id: data.user.id,
          },
        },
      })

      clearCart()
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitLoading(false)
    }
  }

  return (
    <>
      <div className="flex h-full flex-col py-5">
        {products.length > 0 ? (
          <>
            <div className="flex-auto space-y-4">
              {products.map((product) => (
                <CartItem key={product.id} cartProduct={product} />
              ))}
            </div>
            <div className="mt-6">
              <Card>
                <CardContent className="space-y-2 p-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className=" text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(calculateSubtotalPrice)}</span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between text-xs">
                    <span className=" text-muted-foreground">Entrega</span>

                    {Number(products?.[0].restaurant.deliveryFee) === 0 ? (
                      <span className="uppercase text-primary"> Grátis</span>
                    ) : (
                      formatCurrency(
                        Number(products?.[0].restaurant.deliveryFee),
                      )
                    )}
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between text-xs">
                    <span className=" text-muted-foreground">Descontos</span>
                    <span> - {formatCurrency(calculateTotalDiscounts)}</span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(calculateTotalPrice)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Button
              className="mt-6 w-full"
              onClick={() => setIsConfirmationDialogOpen(true)}
              disabled={isSubmitLoading}
            >
              Finalizar Pedido
            </Button>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="font-medium">Seu sacola está vazia</p>
          </div>
        )}
      </div>

      <AlertDialog
        open={isConfirmationDialogOpen}
        onOpenChange={setIsConfirmationDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja finalizar seu pedido?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Ao finalizar seu pedido, você concorda com os termos e condições do
            estabelecimento.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFinishOrder}
              disabled={isSubmitLoading}
            >
              {isSubmitLoading && (
                <Loader2 className="mr-2 inline-block animate-spin" />
              )}
              Finalizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default Cart
